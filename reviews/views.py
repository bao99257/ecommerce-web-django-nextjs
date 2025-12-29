from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Reviews
from orders.models import OrderItem
from .serializer import ReviewSerializer

class CreateReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        user = request.user
        rating = request.data.get("rating")
        comment = request.data.get("comment")
        
        if not rating or not comment:
            return Response(
                {"error": "Rating and comment are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        bought = OrderItem.objects.filter(
            order__user=user,
            product_id=product_id,
            order__status="COMPLETED",
        ).exists()
        
        if not bought:
            return Response(
                {"error": "You can only review products you have bought."},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        if Reviews.objects.filter(user=user, product_id=product_id).exists():
            return Response(
                {"error": "You have already reviewed this product."},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        review = Reviews.objects.create(
            user=user,
            product_id=product_id,
            rating=rating,
            comment=comment,
        )
        
        return Response(
            ReviewSerializer(review).data,
            status=status.HTTP_201_CREATED,
        )
        
class AdminReviewView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        reviews = Reviews.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
class AdminDetailReviewView(APIView):
    permission_classes = [IsAdminUser]
    def get_review(self, pk):
        try:
            return Reviews.objects.get(pk=pk)
        except:
            return None
    
    def get(self, request, pk):
        review = self.get_review(pk)
        if not review:
            return  Response({"error": "Review not found!"}, status=404)
        return Response(ReviewSerializer(review).data)
    
    def put(self, request, pk):
        review = self.get_review(pk)
        if review is None:
            return Response({"error": "Review not found!"}, status=404)

        data = request.data.copy()

        # Cấm đổi user/product:
        data.pop("user", None)
        data.pop("product", None)

        serializer = ReviewSerializer(review, data=data, partial=True)
        if serializer.is_valid():
            updated = serializer.save()
            return Response(ReviewSerializer(updated).data)

        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        review =self.get_review(pk)
        if not review:
            return Response({"error": "Review not found!"})
        review.delete()
        return Response(status=204)
        
            
        
        
    
