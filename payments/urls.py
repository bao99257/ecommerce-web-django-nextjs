from django.urls import path
from .views import VNPayCreatePayment, VNPayReturnView

urlpatterns = [
    path("vnpay/", VNPayCreatePayment.as_view()),
    path("vnpay-return/", VNPayReturnView.as_view()),
]
