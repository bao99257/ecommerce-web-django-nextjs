from rest_framework import serializers
from .models import Reviews

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)
    product = serializers.CharField(source="product.name", read_only=True)
    class Meta:
        model = Reviews
        fields = ["id", "user", "user_name", "product", "rating", "comment", "created_at", "updated_at"]
        read_only_fields = ["user", "product"]
