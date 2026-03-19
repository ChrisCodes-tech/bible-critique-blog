from django.contrib import admin
from .models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("author", "post", "parent", "is_flagged", "created_at")
    list_filter = ("is_flagged",)
    search_fields = ("body", "author__username")
    actions = ["flag_comments", "unflag_comments"]

    def flag_comments(self, request, queryset):
        queryset.update(is_flagged=True)

    def unflag_comments(self, request, queryset):
        queryset.update(is_flagged=False)

    flag_comments.short_description = "Flag selected comments"
    unflag_comments.short_description = "Unflag selected comments"
