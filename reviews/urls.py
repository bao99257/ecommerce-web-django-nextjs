from django.urls import path
from .views import CreateReviewView, AdminReviewView,AdminDetailReviewView

urlpatterns = [
    path("<int:product_id>/", CreateReviewView.as_view()),
    path("all/", AdminReviewView.as_view()),
    path("all/<int:pk>/", AdminDetailReviewView.as_view()),
]