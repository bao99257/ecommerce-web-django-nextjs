

from django.db import models
from django.conf import settings
from products.models import Product

class Order(models.Model):
    PAYMENT_CHOICES = [
        ("COD", "Cash on Delivery"),
        ("MOMO", "Momo"),
        ("VNPAY", "Vnpay"),
    ]

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("SHIPPING", "Shipping"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    address_snapshot = models.JSONField()
    total_price = models.DecimalField( max_digits=12, decimal_places=2)
    shipping_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING", )
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default="COD")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user}"
    
    class Meta:
        db_table = 'Order'
        

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    
    # lưu giá tại thời điểm đặt hàng
    price_at_order = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product} x {self.quantity}"
    
    class Meta:
        db_table= 'OrderItem'
        
    