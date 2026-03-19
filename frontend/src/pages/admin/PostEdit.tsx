import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { postsApi } from "../../api/posts";
import type { PostDetail } from "../../types";
import PostEditor from "../../components/blog/PostEditor";

export function NewPost() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16 animate-fade-in">
      <Link
        to="/admin/posts"
        className="flex items-center gap-1.5 text-sm font-sans text-parchment-muted hover:text-parchment mb-8 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Essays
      </Link>
      <div className="mb-8">
        <p className="text-xs font-sans text-parchment-muted uppercase tracking-widest mb-1">Admin</p>
        <h1 className="font-display text-4xl text-parchment">New Essay</h1>
      </div>
      <PostEditor />
    </div>
  );
}

export function EditPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    postsApi.get(slug).then(({ data }) => setPost(data)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 space-y-4">
        <div className="skeleton h-10 w-1/2 rounded" />
        <div className="skeleton h-48 rounded" />
        <div className="skeleton h-96 rounded" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <p className="font-display text-3xl text-parchment-muted">Post not found</p>
        <Link to="/admin/posts" className="text-amber-blog hover:underline font-sans text-sm mt-4 block">
          ← Back to Essays
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-16 animate-fade-in">
      <Link
        to="/admin/posts"
        className="flex items-center gap-1.5 text-sm font-sans text-parchment-muted hover:text-parchment mb-8 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Essays
      </Link>
      <div className="mb-8">
        <p className="text-xs font-sans text-parchment-muted uppercase tracking-widest mb-1">Admin · Edit</p>
        <h1 className="font-display text-4xl text-parchment">Edit Essay</h1>
      </div>
      <PostEditor post={post} />
    </div>
  );
}
