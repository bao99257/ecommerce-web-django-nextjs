from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Address

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name']

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get("email")
        password = data.get("password")
        
        # Xac thuc user
        user = authenticate(email=email, password=password)
        
        if not user:
            raise serializers.ValidationError("Email hoac mat khau khong dung")
        data["user"] = user
        return data
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email', 'full_name', 'phone', 'avatar', 'is_customer', 'is_seller', 'is_staff']
class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email', 'password', 'full_name', 'phone', 'avatar', 'is_customer', 'is_seller', 'is_staff']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False} 
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
            
        instance.save()
        return instance

class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'phone', 'avatar']
        
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        instance.save()
        return instance
    
    
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'id', 'full_name', 'phone', 'street', 'city', 'is_default'
        ]