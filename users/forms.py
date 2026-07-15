from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class CustomSignUpForm(UserCreationForm):
    class Meta:

        model = CustomUser
        
        fields = (
            'username', 
            'email', 
            'full_name', 
            'address', 
            'designation', 
            'organization', 
            'mobile_number', 
            'working_language', 
            'profile_picture'
        )