from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Category, Product, ProductImage
from .serializers import CategorySerializer, ProductImageSerializer, ProductListSerializer, ProductDetailSerializer
from rest_framework.permissions import IsAdminUser

# Create your views here.

class CategoryListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return []  # Công khai, không cần permission
        return [IsAdminUser()]  # POST yêu cầu admin
    
    def get(self, request):
        categories = Category.objects.filter(is_active=True)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class CategoryDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return []
        return [IsAdminUser()]
        
    def get_category(self, pk):
        try:
            return Category.objects.get(pk=pk)
        except:
            return None;
        
    def get(self, request, pk):
        category = self.get_category(pk)
        if not category:
            return Response({"error": "Not found"}, status=404)
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    
    permission_classes = [IsAdminUser]
    
    def put(self, request, pk):
        category = self.get_category(pk)
        if not category:
            return Response({"error": "Not found"}, status=404)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        category = self.get_category(pk)
        if not category:
            return Response({"error": "Not found"}, status=404)
        category.delete()
        return Response({"message": "Deleted"}, status=204)

class ProductListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return []  
        return [IsAdminUser()]  
    
    def get(self, request):
        category = request.GET.get("category")
        
        products = Product.objects.filter(is_active=True)
        
        if category:
            products = products.filter(category_id = category)
            
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        product_data = request.data
        serializer = ProductListSerializer(data=product_data)
        
        if serializer.is_valid():
            product = serializer.save()
            
            images = request.FILES.getlist("images")
            for img in images:
                ProductImage.objects.create(product=product, image=img)
                
            return Response(serializer.data, status=201)
        
        return Response(serializer)
    
    
class CategoryProductsView(APIView):
    def get(self, request, slug):
        try:
            category = Category.objects.get(slug=slug)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=404)

        products = Product.objects.filter(category=category, is_active=True)
        serializer = ProductListSerializer(products, many=True)

        return Response({
            "category": category.name,
            "products": serializer.data
        })
        
        
    
class ProductDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return []  
        return [IsAdminUser()]  
    
    def get_product(self, pk):
        try:
            return Product.objects.prefetch_related('reviews__user').get(pk=pk)
        except:
            return None;
    
    def get(self, request, pk):
        product = self.get_product(pk)
        if not product:
            return Response({"error": "Not found!"}, status=404)
        return Response(ProductDetailSerializer(product).data)
    
    def put(self, request, pk):
        product = self.get_product(pk)
        if not product:
            return Response({"error": "Not found!"}, status=404)
        
        serializer = ProductDetailSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            product = serializer.save()
            
            if "images" in request.FILES:
                ProductImage.objects.filter(product=product).delete()
                for img in request.FILES.getlist("images"):
                    ProductImage.objects.create(product=product, image=img)
            return Response(ProductDetailSerializer(product).data)        
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        product=self.get_product(pk)
        if not product:
            return Response({"error": "Not found!"}, status=404)
        
        product.delete()
        return Response(status=204)
        
        

    
    