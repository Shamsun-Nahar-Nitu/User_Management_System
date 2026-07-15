from django.contrib import admin

# Register your models here.

from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 
                    'email', 
                    'full_name', 
                    'designation', 
                    'address', 
                    'organization', 
                    'mobile_number', 
                    'working_language']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Profile Info', {
            'fields': (
                'full_name', 
                'address', 
                'designation', 
                'organization', 
                'mobile_number', 
                'working_language', 
                'profile_picture'
            )
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)