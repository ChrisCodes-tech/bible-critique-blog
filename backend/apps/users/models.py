from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Extended user model.
    - username, email, password come from AbstractUser
    - bio and avatar are optional extras
    - is_staff == True  →  treated as Admin (can write posts)
    """

    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True, default="")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.email

    @property
    def is_admin(self) -> bool:
        return self.is_staff or self.is_superuser
