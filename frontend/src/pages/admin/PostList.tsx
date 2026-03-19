import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { postsApi } from "../../api/posts";
import type { PostSummary } from "../../types";
import { formatDate, getApiError } from "../../utils";
import Button from "../../components/ui/Button";

export default function AdminPostList() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchPosts = async () => {
    try {
      const { data } = await postsApi.list({ ordering: "-created_at" });
      setPosts(data.results);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (post: PostSummary) => {
    if (!confirm(`Delete "${post.title}"? This is irreversible.`)) return;
    setDeletingId(post.id);
    try {
      await postsApi.remove(post.slug);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      toast.success("Post deleted.");
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-16 animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs font-sans text-parchment-muted uppercase tracking-widest mb-1">Admin</p>
          <h1 className="font-display text-4xl text-parchment">All Essays</h1>
        </div>
        <Link to="/admin/posts/new">
          <Button size="sm">
            <Plus size={15} /> New Essay
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-16 rounded" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-parchment-muted font-display text-3xl mb-4">No essays yet</p>
          <Link to="/admin/posts/new">
            <Button>Write your first essay</Button>
          </Link>
        </div>
      ) : (
        <div className="border border-ink-muted rounded overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-ink-muted bg-ink-soft">
                <th className="px-5 py-3 text-xs font-sans text-parchment-muted uppercase tracking-widest">Title</th>
                <th className="px-5 py-3 text-xs font-sans text-parchment-muted uppercase tracking-widest hidden sm:table-cell">Status</th>
                <th className="px-5 py-3 text-xs font-sans text-parchment-muted uppercase tracking-widest hidden md:table-cell">Date</th>
                <th className="px-5 py-3 text-xs font-sans text-parchment-muted uppercase tracking-widest hidden md:table-cell">Views</th>
                <th className="px-5 py-3 text-xs font-sans text-parchment-muted uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-muted">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-ink-soft/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-parchment font-serif text-base line-clamp-1">{post.title}</span>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span
                      className={`text-xs font-sans uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                        post.status === "published"
                          ? "border-amber-blog/50 text-amber-blog"
                          : "border-ink-muted text-parchment-muted"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-sans text-parchment-muted hidden md:table-cell">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-5 py-4 text-sm font-sans text-parchment-muted hidden md:table-cell">
                    {post.views}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/posts/${post.slug}`} target="_blank">
                        <button className="p-1.5 text-parchment-muted hover:text-parchment transition-colors">
                          <Eye size={15} />
                        </button>
                      </Link>
                      <Link to={`/admin/posts/${post.slug}/edit`}>
                        <button className="p-1.5 text-parchment-muted hover:text-parchment transition-colors">
                          <Pencil size={15} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(post)}
                        disabled={deletingId === post.id}
                        className="p-1.5 text-parchment-muted hover:text-crimson-light transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
