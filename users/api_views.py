from rest_framework import generics, permissions, status
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.utils import timezone

from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from drf_yasg.utils import swagger_auto_schema

from .models import CustomUser
from .serializers import UserSerializer, RegisterSerializer


class LogoutRequestSerializer(serializers.Serializer):
    refresh = serializers.CharField(
        required=False,
        help_text="Refresh token to blacklist. If omitted, all outstanding refresh tokens for the authenticated user are blacklisted.",
    )


class RegisterAPIView(generics.CreateAPIView):
    """Register a new user."""
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileAPIView(generics.RetrieveUpdateAPIView):
    """Get or update the currently authenticated user."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserListAPIView(generics.ListAPIView):
    """Admin-only paginated list of users."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = CustomUser.objects.only(
        'id',
        'username',
        'email',
        'full_name',
        'address',
        'designation',
        'organization',
        'mobile_number',
        'working_language',
        'profile_picture',
    ).order_by('id')


class LogoutAPIView(APIView):
    """Blacklist the refresh token to log out."""
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(request_body=LogoutRequestSerializer)
    def post(self, request):
        refresh_token = request.data.get("refresh")
        try:
            if refresh_token:
                token = RefreshToken(refresh_token)
                token_user_id = token.get("user_id")
                if token_user_id != request.user.id:
                    return Response(
                        {"detail": "Token does not belong to the authenticated user."},
                        status=status.HTTP_403_FORBIDDEN,
                    )
                token.blacklist()
            else:
                outstanding_tokens = OutstandingToken.objects.filter(
                    user=request.user,
                    expires_at__gte=timezone.now(),
                )
                for outstanding_token in outstanding_tokens:
                    RefreshToken(outstanding_token.token).blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except TokenError:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )