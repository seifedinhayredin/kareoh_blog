from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Post
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly
from .utils import generate_unique_slug



class PostViewSet(ModelViewSet):

    serializer_class = PostSerializer

    permission_classes = [
        IsAuthorOrReadOnly
    ]

    lookup_field = "slug"

    def get_queryset(self):
        user = self.request.user

        # Anonymous users can only see published posts
        if not user.is_authenticated:
            return Post.objects.filter(
                status=Post.Status.PUBLISHED
            )

        # Authenticated users can see:
        # published posts + their own drafts
        return Post.objects.filter(
            status=Post.Status.PUBLISHED
        ) | Post.objects.filter(
            author=user,
            status=Post.Status.DRAFT
        )

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

    @action(
        detail=False,
        methods=["get"],
        url_path="mine",
        permission_classes=[IsAuthenticated],
    )
    def my_posts(self, request):

        posts = Post.objects.filter(
            author=request.user
        )

        serializer = self.get_serializer(
            posts,
            many=True
        )

        return Response(
            serializer.data
        )