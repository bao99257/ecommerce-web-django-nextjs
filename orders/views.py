from itertools import product
from django.core.serializers import serialize
from django.db.models.lookups import Exact
from django.http import response
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from users.models import User
from products.models import Product
from orders.models import Order, OrderItem
from orders.serializers import OrderSerializer
from users.models import Address
from cart.models import Cart

class CheckoutView(APIView):
    permission_classes= [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        address_id = request.data.get("address_id")
        payment_method = request.data.get("payment_method", "COD")
        shipping_fee = request.data.get("shipping_fee", 25000)
        
        try:
            address = Address.objects.get(id=address_id, user=user)
        except:
            return Response({"error": "Address not found"}, status=404)
        
        address_snapshot = {
            "full_name" : address.full_name,
            "phone" : address.phone,
            "street": address.street,
            "city" : address.city,
        }
        
        try:
            cart = Cart.objects.get(user=user)
        except:
            return Response({"error" : "Cart empty"}, status=400)
        
        if cart.items.count() == 0:
            return Response({"error" : "Cart empty"}, status=400)
        
        total_price = sum([
            item.product.price * item.quantity
            for item in cart.items.all()    
        ])
        
        order = Order.objects.create(
            user=user,
            address_snapshot = address_snapshot,
            payment_method = payment_method,
            status = "PENDING",
            total_price = total_price,
            shipping_fee = shipping_fee,
        )
        
        for item in cart.items.all():
            OrderItem.objects.create(
                order = order,
                product = item.product,
                quantity = item.quantity,
                price_at_order = item.product.price
            )
            
        cart.items.all().delete()
        return Response({"message": "Order Create", "order_id": order.id}, status=201)
    
    
class MyOrderView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        orders = request.user.orders.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
        
class OrderDetailView(APIView):
    permission_classes =[IsAuthenticated]
    
    def get(self, request, order_id):
        user = request.user

        try:
            order = Order.objects.get(id=order_id, user=user)
        except:
            return Response({"error": "Order not found"}, status=404)

        serializer = OrderSerializer(order)
        return Response(serializer.data)

class CancleOrderView(APIView):
    def post(self, request, order_id):
        user = request.user
        
        try:
            order = Order.objects.get(id = order_id, user = user)
        except:
            return Response({"error": "Order not found!"}, status=404)
        
        if order.status != "PENDING":
            return Response({"error": "Order can not be change status!"}, status=400)
        
        order.status = "CANCELLED"
        order.save()
        
        return Response({"message" : "Order cancelled"})
        
    
class AdminOrderView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        status_filter = request.GET.get("status")
        user_id = request.GET.get("user")
        
        orders = Order.objects.all().order_by("-created_at")

        if status_filter:
            orders = orders.filter(status=status_filter)

        if user_id:
            orders = orders.filter(user_id=user_id)

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
class AdminOrderDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        serializer = OrderSerializer(order)
        return Response(serializer.data)
        
ALLOWED_FLOW = {
    "PENDING": ["CONFIRMED", "CANCELLED"],
    "CONFIRMED": ["SHIPPING", "CANCELLED"],
    "SHIPPING": ["COMPLETED"],
    "COMPLETED": [],
    "CANCELLED": [],
}

class UpdateOrderStatusView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, order_id):
        new_status = request.data.get("status")

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error":"Order not found!"}, status=404)

        if new_status not in ALLOWED_FLOW.get(order.status, []):
            return Response({"error": f"Cannot change from {order.status} to {new_status}"}, status=400)

        order.status = new_status
        order.save()

        return Response({"message": "Status updated successfully"})

        
class AdminDashboard(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            "user_count": User.objects.count(),
            "product_count": Product.objects.count(),
            "order_count": Order.objects.count(),
        })
