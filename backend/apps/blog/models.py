import math
from django.db import models
from django.utils.text import slugify
from apps.users.models import User


class Tag(models.Model):
    name = models.CharField(max_length=64, unique=True)
    slug = models.SlugField(max_length=64, unique=True, blank=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    excerpt = models.TextField(max_length=500, blank=True)
    body = models.TextField()
    cover_image = models.ImageField(upload_to="covers/", blank=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name="posts")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Post.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        # Auto-generate excerpt from body if empty
        if not self.excerpt and self.body:
            words = self.body.split()
            self.excerpt = " ".join(words[:40]) + ("…" if len(words) > 40 else "")
        super().save(*args, **kwargs)

    @property
    def reading_time(self) -> int:
        """Estimated reading time in minutes (avg 238 wpm)."""
        word_count = len(self.body.split())
        return max(1, math.ceil(word_count / 238))

    @property
    def comment_count(self) -> int:
        return self.comments.filter(parent__isnull=True).count()

    def __str__(self):
        return self.title
