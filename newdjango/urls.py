"""
URL configuration for newdjango project.
"""

from django.contrib import admin
from django.urls import include, path, re_path
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="User Management API",
        default_version='v1',
        description="""
User Management REST API with JWT Authentication.

Authentication Flow:
1. POST /api/register/
2. POST /api/token/
3. Authorization: ******
4. POST /api/token/refresh/
5. POST /api/logout/
        """,
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    authentication_classes=[],  # disable auth requirement for Swagger docs
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('users.urls')),
]

# Expose docs only in development
if settings.DEBUG:
    urlpatterns += [
        re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=3600), name='schema-json'),
        path('swagger/', schema_view.with_ui('swagger', cache_timeout=3600), name='schema-swagger-ui'),
        path('redoc/', schema_view.with_ui('redoc', cache_timeout=3600), name='schema-redoc'),
    ]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)