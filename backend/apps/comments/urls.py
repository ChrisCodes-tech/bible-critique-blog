from django.urls import path
from .views import CommentListCreateView, CommentDetailView

urlpatterns = [
    path("posts/<int:post_id>/", CommentListCreateView.as_view(), name="comment-list"),
    path("<int:pk>/", CommentDetailView.as_view(), name="comment-detail"),
]
