from django.urls import path
from .views import TagListView, PostListView, PostDetailView

urlpatterns = [
    path("tags/", TagListView.as_view(), name="tag-list"),
    path("posts/", PostListView.as_view(), name="post-list"),
    path("posts/<slug:slug>/", PostDetailView.as_view(), name="post-detail"),
]
