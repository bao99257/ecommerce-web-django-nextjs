from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)
    
    
class User(AbstractBaseUser, PermissionsMixin):
    email       = models.EmailField(unique=True)
    full_name   = models.CharField(max_length=255, blank=True)
    phone       = models.CharField(max_length=10, blank=True)
    avatar      = models.ImageField(upload_to='avatars/', blank=True, null=True)
    
    # roles
    is_customer = models.BooleanField(default=True)
    is_seller   = models.BooleanField(default=False)
    
    # django default fields
    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = UserManager()
    
    def __str__(self):
        return self.email
    
    class Meta:
        db_table = 'Users'
    
class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.full_name} - {self.street}, {self.city}"
    
    class Meta:
        db_table = 'Address'

