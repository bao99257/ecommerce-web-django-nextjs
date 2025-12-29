from django.urls import path
from .views import RegisterView, LoginView, UserMeView, UpdateUserView,AddressListCreateView, AddressDetailView, AdminUserList
from .admin_views import AdminUserListCreate, AdminUserDetail

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", UserMeView.as_view(), name="me"),
    path("me/update/", UpdateUserView.as_view(), name="me-update"),
    path("admin/users/", AdminUserListCreate.as_view()),
    path("admin/users/<int:pk>/", AdminUserDetail.as_view())
]

urlpatterns += [
    path("addresses/", AddressListCreateView.as_view()),
    path("addresses/<int:pk>/", AddressDetailView.as_view()),
]
