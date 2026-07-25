from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import PostViewSet

router = DefaultRouter()
router.register('posts', PostViewSet, basename='posts')

urlpatterns = router.urls

