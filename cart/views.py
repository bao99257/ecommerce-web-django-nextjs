from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Cart, CartItem
from .serializer import CartSerializer
from products.models import Product

def get_or_create_cart(user):
    cart, created = Cart.objects.get_or_create(user=user)
    return cart

class CartView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        cart = get_or_create_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity",1))
        
        try:
            product = Product.objects.get(id = product_id)
        except:
            return Response({"error": "Product not found!"}, status=404)
        
        cart = get_or_create_cart(user=request.user)
        
        #Nếu sản phẩm có trong giỏ hàng thì tăng số lượng sản phẩm
        cart_item, created = CartItem.objects.get_or_create(
            cart = cart,
            product=product
        )
        
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        
        cart_item.save()
        return Response({"message": "Added to cart!"}, status=200)
    
class UpdateCartItemView(APIView):
        permission_classes = [IsAuthenticated]
        
        def put(self, request, item_id):
            quantity = int(request.data.get("quantity"))
            try:
                item = CartItem.objects.get(id = item_id, cart__user = request.user)
            except:
                return Response({"error": "Item not found!"}, status=404)
            
            item.quantity = quantity
            item.save()
            
            return Response({"Message": "Item updated!"}, status=200)
        
class DeleteCartItem(APIView)  :
        permission_classes = [IsAuthenticated]
        
        def delete(self, request, item_id):
            try:
                item = CartItem.objects.get(id = item_id, cart__user = request.user)
            except:
                return Response({"error": "Item not found!"}, status=404)
            
            item.delete()
            return Response({"message": "Deleted item!"}, status=200)
        
    



