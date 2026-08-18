from django.contrib.auth import get_user_model

from rest_framework import serializers

from .models import Post, Comment,Like


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "first_name",
            "last_name",
        ]


class PostSerializer(serializers.ModelSerializer):

    author = UserSerializer(
        read_only=True
    )

    like_count = serializers.IntegerField(
        source="likes.count",
        read_only=True
    )

    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post

        fields = [
            "id",
            "title",
            "slug",
            "author",
            "body",
            "publish",
            "created",
            "updated",
            "status",
            "like_count",
            "is_liked",
        ]

        read_only_fields = [
            "id",
            "slug",
            "author",
            "created",
            "updated",
            "like_count",
            "is_liked",
        ]

    def get_is_liked(self, obj):

        request = self.context.get(
            "request"
        )

        if not request:
            return False

        if not request.user.is_authenticated:
            return False

        return Like.objects.filter(
            post=obj,
            user=request.user
        ).exists()

class CommentSerializer(serializers.ModelSerializer):

    author = UserSerializer(
        read_only=True
    )

    class Meta:
        model = Comment

        fields = [
            "id",
            "post",
            "author",
            "body",
            "created",
            "updated",
            "active",
        ]

        read_only_fields = [
            "id",
            "post",
            "author",
            "created",
            "updated",
            "active",
        ]