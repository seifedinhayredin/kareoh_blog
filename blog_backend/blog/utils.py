from django.utils.text import slugify


def generate_unique_slug(model, title, instance=None):
    base_slug = slugify(title)

    slug = base_slug

    counter = 2

    queryset = model.objects.all()

    if instance:
        queryset = queryset.exclude(
            pk=instance.pk
        )

    while queryset.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug