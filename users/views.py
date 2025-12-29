from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, UpdateUserSerializer, AddressSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import Address, User
from rest_framework.parsers import MultiPartParser, FormParser





class RegisterView(APIView):
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
    

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "Login successful",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "email": user.email,
                    "full_name": user.full_name,
                    "is_customer": user.is_customer,
                    "is_seller": user.is_seller
                }
            }, status=201)
        return Response(serializer.errors, status=400)
    
class UserMeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=200)
    
class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def put(self, request):
        user = request.user
        serializer = UpdateUserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully"}, status=200)
        return Response(serializer.errors, status=400)
    
class AddressListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        addresses = request.user.addresses.all()
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data, status=200)
    
    def post(self, request):
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            # Neu user chon is_default thi tat default o dia chi khac 
            if serializer.validated_data.get("is_default", False):
                request.user.addresses.update(is_default=False)
            serializer.save(user=request.user)
            return Response({"message": "Address create"}, status=200)
        return Response(serializer.errors, status=400)
    
class AddressDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):
        try:
            return Address.objects.get(pk=pk, user=request.user)
        except Address.DoesNotExist:
            return None


    def get(self, request, pk):
        address = self.get_object(request, pk)
        if not address:
            return Response({"error": "Address not found"}, status=404)

        serializer = AddressSerializer(address)
        return Response(serializer.data, status=200)
    
    
    def put(self, request, pk):
        address = self.get_object(request, pk)
        if not address:
            return Response({"error": "Address not found"}, status=404)

        serializer = AddressSerializer(address, data=request.data, partial=True)

        if serializer.is_valid():
            # Xử lý default
            if serializer.validated_data.get("is_default", False):
                request.user.addresses.update(is_default=False)

            serializer.save()
            return Response({"message": "Address updated"}, status=200)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        address = self.get_object(request, pk)
        if not address:
            return Response({"error": "Address not found"}, status=404)

        address.delete()
        return Response({"message": "Address deleted"}, status=204)


class AdminUserList(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        data = [{"id": u.id, "username": u.full_name, "email": u.email, "is_staff": u.is_staff} for u in users]
        return Response(data)
