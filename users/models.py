from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser): 
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, max_length=254)    
    address = models.TextField(blank=True, null=True)
    designation = models.CharField(max_length=100, blank=True, null=True)
    organization = models.CharField(max_length=150, blank=True, null=True)
    mobile_number = models.CharField(max_length=20, blank=True, null=True)
    working_language = models.CharField(max_length=50, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.username