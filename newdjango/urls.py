"""
URL configuration for newdjango project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.api_views import RegisterAPIView, ProfileAPIView, UserListAPIView, LogoutAPIView

token_patterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterAPIView.as_view(), name='api-register'),
    path('api/profile/', ProfileAPIView.as_view(), name='api-me'),
    path('api/users/', UserListAPIView.as_view(), name='api-users'),
    path('api/logout/', LogoutAPIView.as_view(), name='api-logout'),
]

schema_view = get_schema_view(
    openapi.Info(
        title="User Management API",
        default_version='v1',
        description="""
User Management REST API with JWT Authentication.

**Authentication Flow:**
1. `POST /api/register/` — Create a new account
2. `POST /api/token/` — **Login** — returns access + refresh tokens
3. Use `Authorization: Bearer <access_token>` on protected endpoints
4. `POST /api/token/refresh/` — Get a new access token when it expires
5. `POST /api/logout/` — Invalidate refresh token
        """,
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    patterns=token_patterns,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('users.urls')),

    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)