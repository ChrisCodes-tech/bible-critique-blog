from rest_framework import serializers
from .models import Post, Tag
from apps.users.serializers import PublicUserSerializer


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name", "slug")


class PostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""

    author = PublicUserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    reading_time = serializers.IntegerField(read_only=True)
    comment_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = (
            "id",
            "author",
            "title",
            "slug",
            "excerpt",
            "cover_image",
            "tags",
            "status",
            "views",
            "reading_time",
            "comment_count",
            "created_at",
            "updated_at",
        )


class PostDetailSerializer(serializers.ModelSerializer):
    """Full detail including body."""

    author = PublicUserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        write_only=True,
        required=False,
        source="tags",
    )
    reading_time = serializers.IntegerField(read_only=True)
    comment_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = (
            "id",
            "author",
            "title",
            "slug",
            "excerpt",
            "body",
            "cover_image",
            "tags",
            "tag_ids",
            "status",
            "views",
            "reading_time",
            "comment_count",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "slug", "author", "views", "created_at", "updated_at")

    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        post = Post.objects.create(**validated_data)
        post.tags.set(tags)
        return post

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags is not None:
            instance.tags.set(tags)
        return instance
