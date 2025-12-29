from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAdminUser
from .models import User
from .serializers import AdminUserSerializer, RegisterSerializer

class AdminUserListCreate(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        users = User.objects.all().order_by("-id")
        return Response(AdminUserSerializer(users, many=True).data )
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Register successful",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=201)
            
        return Response(serializer.errors, status=400)
    
class AdminUserDetail(APIView):
    permission_classes = [IsAdminUser]
    
    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None
    
    def get(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({"error": "User not found!"})
        return Response(AdminUserSerializer(user).data)
    
    def put(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({"error": "User not found!"})
        serializer = AdminUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response(AdminUserSerializer(user).data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({"error": "User not found!"})
        
        user.delete()
        return Response(status=204)
        