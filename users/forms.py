from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError

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
            'profile_picture',
        )

    def clean_profile_picture(self):
        picture = self.cleaned_data.get("profile_picture")
        if not picture:
            return picture

        max_size = 2 * 1024 * 1024  # 2MB
        if picture.size > max_size:
            raise ValidationError("Max profile picture size is 2MB.")

        allowed_types = {"image/jpeg", "image/png", "image/webp"}
        content_type = getattr(picture, "content_type", None)
        if content_type and content_type not in allowed_types:
            raise ValidationError("Only JPEG, PNG, and WEBP images are allowed.")

        return picture