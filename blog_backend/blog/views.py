from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView

from .models import Post, Comment, Like,PostImage, PostShare,Profile
from .utils import generate_unique_slug


from .permissions import (
    IsAuthorOrReadOnly,
)

from .serializers import (
    PostSerializer,
    CommentSerializer,
    PostImageSerializer,
    ProfileSerializer,
    
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

    #For like button
    @action(
    detail=True,
    methods=["post", "delete"],
    url_path="like",
    permission_classes=[IsAuthenticated],
    )
    def like(
        self,
        request,
        slug=None
    ):

        post = self.get_object()

    # =========================
    # LIKE
    # =========================

        if request.method == "POST":

            like, created = Like.objects.get_or_create(
                post=post,
                user=request.user
            )

            return Response(
                {
                    "liked": True,
                    "created": created,
                    "like_count": Like.objects.filter(
                        post=post
                    ).count(),
                },
                status=200
            )

    # =========================
    # UNLIKE
    # =========================

        deleted, _ = Like.objects.filter(
            post=post,
            user=request.user
        ).delete()

        return Response(
            {
                "liked": False,
                "like_count": Like.objects.filter(
                    post=post
                ).count(),
            },
            status=200
        )

    #For image upload
    @action(
    detail=True,
    methods=["post"],
    url_path="upload-image",
    permission_classes=[IsAuthenticated],
    )
    def upload_image(self, request, slug=None):

        post = self.get_object()

        # Only the post owner can upload images
        if post.author != request.user:
            return Response(
                {
                    "detail": (
                        "You do not have permission "
                        "to upload images to this post."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        image = request.FILES.get("image")

        if not image:
            return Response(
                {
                    "detail": "No image was provided."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        post_image = PostImage.objects.create(
            post=post,
            image=image,
        )

        serializer = PostImageSerializer(
            post_image,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )
    #For sharing a post
    @action(
    detail=True,
    methods=["post"],
    permission_classes=[IsAuthenticated],
    )
    def share(self, request, slug=None):

        post = self.get_object()

        share, created = PostShare.objects.get_or_create(
            post=post,
            user=request.user,
        )

        return Response(
            {
                "message": (
                    "Post shared successfully."
                    if created
                    else "You have already shared this post."
                ),
                "share_count": post.shares.count(),
                "has_shared": True,
            },
            status=(
                status.HTTP_201_CREATED
                if created
                else status.HTTP_200_OK
            ),
        )



class ProfileView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        profile, created = Profile.objects.get_or_create(
            user=request.user
        )

        serializer = ProfileSerializer(
            profile
        )

        return Response(
            serializer.data
        )

    def patch(self, request):

        profile, created = Profile.objects.get_or_create(
            user=request.user
        )

        serializer = ProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            serializer.data
        )