from django.contrib.auth import get_user_model

from rest_framework import serializers

from .models import Post, Comment


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
        ]

        read_only_fields = [
            "id",
            "slug",
            "author",
            "created",
            "updated",
        ]

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