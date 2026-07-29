from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = (
        'username',
        'email',
        'full_name',
        'mobile_number',
        'designation',
        'organization',
        'is_staff',
        'is_active',
    )

    fieldsets = UserAdmin.fieldsets + (
        ('Custom Profile Info', {
            'fields': (
                'full_name',
                'address',
                'designation',
                'organization',
                'mobile_number',
                'working_language',
                'profile_picture',
            )
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Profile Info', {
            'fields': (
                'full_name',
                'email',
                'address',
                'designation',
                'organization',
                'mobile_number',
                'working_language',
                'profile_picture',
            )
        }),
    )