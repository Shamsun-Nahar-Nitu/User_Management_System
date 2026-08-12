from rest_framework import serializers
from .models import CustomUser


class ProfilePictureValidationMixin:
    def validate_profile_picture(self, value):
        if not value:
            return value

        max_size = 2 * 1024 * 1024  # 2MB
        if value.size > max_size:
            raise serializers.ValidationError("Max profile picture size is 2MB.")

        allowed_content_types = {"image/jpeg", "image/png", "image/webp"}
        content_type = getattr(value, "content_type", None)
        if content_type and content_type not in allowed_content_types:
            raise serializers.ValidationError("Only JPEG, PNG, and WEBP images are allowed.")

        return value


class UserSerializer(ProfilePictureValidationMixin, serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id',
            'username',
            'email',
            'full_name',
            'address',
            'designation',
            'organization',
            'mobile_number',
            'working_language',
            'profile_picture',
        ]
        read_only_fields = ['id', 'username', 'email']


class RegisterSerializer(ProfilePictureValidationMixin, serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = [
            'username',
            'email',
            'full_name',
            'address',
            'designation',
            'organization',
            'mobile_number',
            'working_language',
            'profile_picture',
            'password',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs.get('new_password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({
                'confirm_password': 'New password and confirm password do not match.'
            })
        return attrs


class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'full_name', 'address', 'designation',
            'organization', 'mobile_number', 'working_language', 'profile_picture', 'password', 'is_staff',
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = CustomUser(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance