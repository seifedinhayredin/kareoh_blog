from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet

from .models import Post
from .serializers import PostSerializer


class PostViewSet(ModelViewSet):

    queryset = Post.objects.all()

    serializer_class = PostSerializer

    permission_classes = [
        IsAuthenticatedOrReadOnly
    ]

    lookup_field = "slug"

    def perform_create(self, serializer):
        from django.utils.text import slugify

        title = serializer.validated_data["title"]

        serializer.save(
            author=self.request.user,
            slug=slugify(title),
        )