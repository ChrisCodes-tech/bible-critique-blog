import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Clock, Eye, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { postsApi } from "../api/posts";
import type { PostDetail } from "../types";
import { formatDate, avatarUrl, getApiError } from "../utils";
import TagBadge from "../components/blog/TagBadge";
import CommentSection from "../components/comments/CommentSection";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    postsApi
      .get(slug)
      .then(({ data }) => setPost(data))
      .catch((e) => {
        if (e?.response?.status === 404) setNotFound(true);
        else toast.error("Could not load post.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleDelete = async () => {
    if (!post || !confirm("Permanently delete this post?")) return;
    setDeleting(true);
    try {
      await postsApi.remove(post.slug);
      toast.success("Post deleted.");
      navigate("/");
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 space-y-6">
        <div className="skeleton h-10 w-3/4 rounded" />
        <div className="skeleton h-6 w-1/2 rounded" />
        <div className="skeleton h-64 w-full rounded" />
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-4 w-full rounded" />)}
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <p className="font-display text-4xl text-parchment-muted mb-4">Essay not found</p>
        <Link to="/" className="text-amber-blog hover:underline font-sans">← Back to Essays</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative">
        {post.cover_image ? (
          <div className="relative h-[50vh] overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/50 to-ink" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-b from-ink-soft to-ink" />
        )}
      </div>

      <div className="max-w-3xl mx-auto px-5">
        {/* Back */}
        <div className="flex items-center justify-between py-6">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-sans text-parchment-muted hover:text-parchment transition-colors"
          >
            <ArrowLeft size={14} /> All Essays
          </Link>

          {/* Admin actions */}
          {user?.is_admin && (
            <div className="flex items-center gap-3">
              <Link to={`/admin/posts/${post.slug}/edit`}>
                <Button variant="secondary" size="sm">
                  <Pencil size={13} /> Edit
                </Button>
              </Link>
              <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
                <Trash2 size={13} /> Delete
              </Button>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}
          </div>
        )}

        {/* Title */}
        <h1 className="font-display text-4xl md:text-6xl text-parchment font-light leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 pb-8 border-b border-ink-muted flex-wrap">
          <div className="flex items-center gap-2">
            <img
              src={avatarUrl(post.author.avatar, post.author.username)}
              alt={post.author.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-sans text-parchment-muted">{post.author.username}</span>
          </div>
          <span className="text-parchment-muted text-sm font-sans">{formatDate(post.created_at)}</span>
          <span className="flex items-center gap-1 text-sm font-sans text-parchment-muted">
            <Clock size={13} /> {post.reading_time} min read
          </span>
          <span className="flex items-center gap-1 text-sm font-sans text-parchment-muted">
            <Eye size={13} /> {post.views} views
          </span>
        </div>

        {/* Body */}
        <div
          className="post-body py-10"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-ink-muted" />
          <div className="w-2 h-2 rotate-45 border border-amber-blog" />
          <div className="flex-1 h-px bg-ink-muted" />
        </div>

        {/* Comment section */}
        <CommentSection postId={post.id} />

        <div className="pb-20" />
      </div>
    </div>
  );
}
