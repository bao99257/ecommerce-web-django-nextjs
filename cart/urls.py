from django.urls import path
from .views import CartView, AddToCartView, UpdateCartItemView, DeleteCartItem

urlpatterns = [
    path("", CartView.as_view()),
    path("add/", AddToCartView.as_view()),
    path("update/<int:item_id>/", UpdateCartItemView.as_view()),
    path("remove/<int:item_id>/", DeleteCartItem.as_view()),
]
