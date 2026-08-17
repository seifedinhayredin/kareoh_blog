from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.shortcuts import get_object_or_404

from .models import Post, Comment
from .utils import generate_unique_slug

from .permissions import (
    IsAuthorOrReadOnly,
)

from .serializers import (
    PostSerializer,
    CommentSerializer,
)


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

    @action(
        detail=True,
        methods=["get", "post"],
        url_path="comments",
        permission_classes=[IsAuthenticated],
    )
    def comments(self, request, slug=None):

        post = self.get_object()

        # =========================
        # GET COMMENTS
        # =========================

        if request.method == "GET":

            comments = Comment.objects.filter(
                post=post,
                active=True
            )

            serializer = CommentSerializer(
                comments,
                many=True
            )

            return Response(
                serializer.data
            )

        # =========================
        # CREATE COMMENT
        # =========================

        if not request.user.is_authenticated:

            return Response(
                {
                    "detail":
                    "Authentication credentials were not provided."
                },
                status=401
            )

        serializer = CommentSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save(
            post=post,
            author=request.user
        )

        return Response(
            serializer.data,
            status=201
        )
    @action(
    detail=True,
    methods=["patch", "delete"],
    url_path=r"comments/(?P<comment_id>[^/.]+)",
    permission_classes=[IsAuthenticated],
    )
    def manage_comment(
        self,
        request,
        slug=None,
        comment_id=None,
    ):

        post = self.get_object()

        # Find the comment belonging to this post
        comment = get_object_or_404(
            Comment,
            id=comment_id,
            post=post,
            active=True,
        )

        # =========================
        # OWNERSHIP CHECK
        # =========================

        if comment.author != request.user:

            return Response(
                {
                    "detail":
                    "You do not have permission to modify this comment."
                },
                status=403,
            )

        # =========================
        # UPDATE COMMENT
        # =========================

        if request.method == "PATCH":

            serializer = CommentSerializer(
                comment,
                data=request.data,
                partial=True,
            )

            serializer.is_valid(
                raise_exception=True
            )

            serializer.save()

            return Response(
                serializer.data,
                status=200,
            )

        # =========================
        # DELETE COMMENT
        # =========================

        if request.method == "DELETE":

            comment.delete()

            return Response(
                status=204
            )