from django.conf import settings
from django.db import models
from django.utils import timezone

class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DR','Draft'
        PUBLISHED = 'PB','Published'


    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=250,unique=True)
    author = models.ForeignKey(
         settings.AUTH_USER_MODEL,
         on_delete=models.CASCADE,
         related_name="blog_post"
    )
    body = models.TextField()
    publish = models.DateTimeField(default=timezone.now)
    created = models.DateTimeField(auto_now_add=True)   
    updated = models.DateTimeField(auto_now=True) 
    status = models.CharField(
        max_length=2,
        choices=Status,
        default=Status.DRAFT
    )  


    class Meta:
        ordering = ['-publish']
        indexes = [
            models.Index(fields=['-publish']),
        ]
        

    def __str__(self):
        return self.title


class Comment(models.Model):

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    body = models.TextField()

    created = models.DateTimeField(
        auto_now_add=True
    )

    updated = models.DateTimeField(
        auto_now=True
    )

    active = models.BooleanField(
        default=True
    )

    class Meta:
        ordering = ["created"]
        indexes = [
            models.Index(
                fields=["post", "created"]
            ),
        ]

    def __str__(self):
        return (
            f"Comment by "
            f"{self.author} "
            f"on {self.post}"
        )

class Like(models.Model):

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="likes"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="post_likes"
    )

    created = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["post", "user"],
                name="unique_post_like"
            )
        ]

        ordering = ["-created"]

    def __str__(self):
        return f"{self.user} liked {self.post}"

class PostImage(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to="posts/images/"
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Image for {self.post.title}"

#Share 

class PostShare(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="shares",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="post_shares",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["post", "user"],
                name="unique_post_share_per_user",
            )
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} shared {self.post.title}"