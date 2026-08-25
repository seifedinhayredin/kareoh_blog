from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import PostViewSet,ProfileView


router = DefaultRouter()

router.register(
    r"posts",
    PostViewSet,
    basename="posts"
)


urlpatterns = [
    path(
        "",
        include(router.urls)
    ),
    # Current user's profile
    path(
        "auth/profile/",
        ProfileView.as_view(),
        name="profile",
    ),
]