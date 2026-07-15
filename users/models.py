# users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # AbstractUser already provides 'username' and 'password'
    
    full_name = models.CharField(max_length=255)
    # Overriding default email to make it unique and required
    email = models.EmailField(unique=True, max_length=254) 
    
    address = models.TextField(blank=True, null=True)
    designation = models.CharField(max_length=100, blank=True, null=True)
    organization = models.CharField(max_length=150, blank=True, null=True)
    mobile_number = models.CharField(max_length=20, blank=True, null=True)
    working_language = models.CharField(max_length=50, blank=True, null=True)
    
    # upload_to determines the folder inside your MEDIA_ROOT where images are saved
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.username