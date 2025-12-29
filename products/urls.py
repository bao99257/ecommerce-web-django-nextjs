from django.urls import path
from .views import CategoryDetailView, CategoryListCreateView, ProductListCreateView, ProductDetailView, CategoryProductsView

urlpatterns = [
    path("categories/", CategoryListCreateView.as_view()),
    path("categories/<int:pk>/", CategoryDetailView.as_view()),
    path("products/", ProductListCreateView.as_view()),
    path("products/<int:pk>/", ProductDetailView.as_view()),
    path("categories/<slug:slug>/products/", CategoryProductsView.as_view()),

]
