from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .api_views import RegisterAPIView, ProfileAPIView, UserListAPIView, LogoutAPIView
from .views import HomeView, SignUpView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('signup/', SignUpView.as_view(), name='signup'),

    path('auth/register/', RegisterAPIView.as_view(), name='api-register'),
    path('users/profile/', ProfileAPIView.as_view(), name='api-profile'),
    path('users/details', UserListAPIView.as_view(), name='api-users'),

    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutAPIView.as_view(), name='api-logout'),
]