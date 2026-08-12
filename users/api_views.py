from rest_framework import generics, permissions, status
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.utils import timezone

from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from drf_yasg.utils import swagger_auto_schema
import logging

from .models import CustomUser
from .serializers import UserSerializer, RegisterSerializer, ChangePasswordSerializer
from .permissions import IsOwnerOrAdmin

logger = logging.getLogger('users')


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

    def perform_create(self, serializer):
        user = serializer.save()
        logger.info("New user registered: %s (id=%s)", user.username, user.id)


class ProfileAPIView(generics.RetrieveUpdateAPIView):
    """Get or update the currently authenticated user (owner or admin)."""
    serializer_class = UserSerializer
    permission_classes = [IsOwnerOrAdmin]

    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        user = serializer.save()
        logger.info("User profile updated: %s (id=%s)", user.username, user.id)


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
                logger.info("User %s logged out using provided refresh token.", request.user.username)
            else:
                outstanding_tokens = OutstandingToken.objects.filter(
                    user=request.user,
                    expires_at__gte=timezone.now(),
                )
                count = outstanding_tokens.count()
                for outstanding_token in outstanding_tokens:
                    RefreshToken(outstanding_token.token).blacklist()
                logger.info("User %s logged out; blacklisted %d outstanding token(s).", request.user.username, count)

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except TokenError:
            logger.warning("Invalid or expired refresh token for user %s", request.user.username)
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ChangePasswordAPIView(APIView):
    """Change password for the authenticated user."""
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(request_body=ChangePasswordSerializer)
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']

        if not user.check_password(old_password):
            logger.warning("User %s provided wrong old password.", user.username)
            return Response({'old_password': 'Wrong password.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        # Revoke outstanding refresh tokens so existing sessions require re-login
        outstanding_tokens = OutstandingToken.objects.filter(
            user=user,
            expires_at__gte=timezone.now(),
        )
        for outstanding_token in outstanding_tokens:
            try:
                RefreshToken(outstanding_token.token).blacklist()
            except TokenError:
                continue

        logger.info("User %s changed password.", user.username)
        return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)