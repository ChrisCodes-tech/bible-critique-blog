from rest_framework import generics, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend

from .models import Post, Tag
from .serializers import PostListSerializer, PostDetailSerializer, TagSerializer
from .permissions import IsAdminOrReadOnly


class TagListView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAdminOrReadOnly]


class PostListView(generics.ListCreateAPIView):
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "tags__slug"]
    search_fields = ["title", "excerpt", "body"]
    ordering_fields = ["created_at", "views"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PostDetailSerializer
        return PostListSerializer

    def get_queryset(self):
        qs = Post.objects.select_related("author").prefetch_related("tags", "comments")
        # Non-admin users only see published posts
        user = self.request.user
        if not (user.is_authenticated and user.is_admin):
            qs = qs.filter(status=Post.Status.PUBLISHED)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostDetailSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"

    def get_queryset(self):
        qs = Post.objects.select_related("author").prefetch_related("tags")
        user = self.request.user
        if not (user.is_authenticated and user.is_admin):
            qs = qs.filter(status=Post.Status.PUBLISHED)
        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view counter on every retrieval (simple approach)
        Post.objects.filter(pk=instance.pk).update(views=instance.views + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
