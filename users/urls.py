from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .api_views import RegisterAPIView, ProfileAPIView, UserListAPIView
from .views import HomeView, SignUpView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('signup/', SignUpView.as_view(), name='signup'),

    path('api/register/', RegisterAPIView.as_view(), name='api-register'),
    path('api/profile/', ProfileAPIView.as_view(), name='api-me'),
    path('api/users/', UserListAPIView.as_view(), name='api-users'),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('accounts/', include('django.contrib.auth.urls')),
]