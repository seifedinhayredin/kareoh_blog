from rest_framework.permissions import (
    BasePermission,
    SAFE_METHODS,
)


class IsAuthorOrReadOnly(BasePermission):
    """
    Anyone can read a post.

    Only the author can update or delete it.
    """

    def has_permission(
        self,
        request,
        view
    ):
        # Anyone can perform GET, HEAD, OPTIONS
        if request.method in SAFE_METHODS:
            return True

        # POST/PUT/PATCH/DELETE require login
        return (
            request.user
            and request.user.is_authenticated
        )

    def has_object_permission(
        self,
        request,
        view,
        obj
    ):
        # Anyone can read
        if request.method in SAFE_METHODS:
            return True

        # Only author can modify/delete
        return obj.author == request.user


class IsCommentAuthorOrReadOnly(BasePermission):
    """
    Anyone can read comments.

    Only the comment author can
    update or delete the comment.
    """

    def has_permission(
        self,
        request,
        view
    ):
        if request.method in SAFE_METHODS:
            return True

        return (
            request.user
            and request.user.is_authenticated
        )

    def has_object_permission(
        self,
        request,
        view,
        obj
    ):
        if request.method in SAFE_METHODS:
            return True

        return obj.author == request.user