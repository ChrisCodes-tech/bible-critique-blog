from rest_framework import serializers
from .models import Comment
from apps.users.serializers import PublicUserSerializer


class ReplySerializer(serializers.ModelSerializer):
    author = PublicUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ("id", "author", "body", "created_at", "updated_at")
        read_only_fields = ("id", "author", "created_at", "updated_at")


class CommentSerializer(serializers.ModelSerializer):
    author = PublicUserSerializer(read_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    reply_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = (
            "id",
            "post",
            "author",
            "parent",
            "body",
            "replies",
            "reply_count",
            "is_flagged",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "author",
            "replies",
            "reply_count",
            "is_flagged",
            "created_at",
            "updated_at",
        )

    def get_reply_count(self, obj):
        return obj.replies.count()

    def validate(self, attrs):
        parent = attrs.get("parent")
        post = attrs.get("post")
        if parent and parent.post != post:
            raise serializers.ValidationError(
                {"parent": "Parent comment does not belong to this post."}
            )
        if parent and parent.parent is not None:
            raise serializers.ValidationError(
                {"parent": "Replies to replies are not allowed (max 2 levels)."}
            )
        return attrs
