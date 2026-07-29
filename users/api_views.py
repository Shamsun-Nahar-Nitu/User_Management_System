from rest_framework import generics, permissions
from .models import CustomUser
from .serializers import UserSerializer, RegisterSerializer


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
    """Admin-only list of all users."""
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]