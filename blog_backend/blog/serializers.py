from rest_framework import serializers

from .models import Post


class PostSerializer(serializers.ModelSerializer):

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
            "author",
            "slug",
            "created",
            "updated",
        ]