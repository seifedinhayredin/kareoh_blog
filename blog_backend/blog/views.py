from rest_framework.viewsets import ModelViewSet

from .models import Post
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly
from .utils import generate_unique_slug


class PostViewSet(ModelViewSet):

    queryset = Post.objects.all()

    serializer_class = PostSerializer

    permission_classes = [
        IsAuthorOrReadOnly
    ]

    lookup_field = "slug"

    def perform_create(self, serializer):

        title = serializer.validated_data["title"]

        slug = generate_unique_slug(
            Post,
            title
        )

        serializer.save(
            author=self.request.user,
            slug=slug
        )