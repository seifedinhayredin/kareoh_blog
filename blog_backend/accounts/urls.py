from django.urls import path
from .views import RefreshAPIView, RegisterAPIView, LoginAPIView, MeAPIView,LogoutAPIView,CSRFTokenAPIView

urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("me/", MeAPIView.as_view(), name="me"),
    path("refresh/", RefreshAPIView.as_view(), name="refresh"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("csrf/", CSRFTokenAPIView.as_view(), name="csrf"),

]