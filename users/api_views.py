from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import CustomUser
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides default `create()`, `retrieve()`, `update()`,
    `partial_update()`, `destroy()` and `list()` actions.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    # Override permissions based on the action
    def get_permissions(self):
        if self.action == 'create':
            # Allow anyone to create an account (Sign Up)
            return [AllowAny()]
        # Require a token for everything else (Read, Update, Delete)
        return [IsAuthenticated()]