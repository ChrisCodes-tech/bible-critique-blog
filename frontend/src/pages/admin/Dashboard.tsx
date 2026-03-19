import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PenLine, BookOpen, Eye, MessageSquare, TrendingUp } from "lucide-react";
import { postsApi } from "../../api/posts";
import type { PaginatedResponse, PostSummary } from "../../types";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<PaginatedResponse<PostSummary> | null>(null);

  useEffect(() => {
    postsApi.list({ ordering: "-created_at" }).then(({ data }) => setData(data));
  }, []);

  const published = data?.results.filter((p) => p.status === "published").length ?? 0;
  const drafts = data?.results.filter((p) => p.status === "draft").length ?? 0;
  const totalViews = data?.results.reduce((sum, p) => sum + p.views, 0) ?? 0;
  const totalComments = data?.results.reduce((sum, p) => sum + p.comment_count, 0) ?? 0;

  const stats = [
    { label: "Published", value: published, icon: BookOpen, color: "text-amber-blog" },
    { label: "Drafts", value: drafts, icon: PenLine, color: "text-parchment-muted" },
    { label: "Total Views", value: totalViews, icon: Eye, color: "text-parchment" },
    { label: "Total Comments", value: totalComments, icon: MessageSquare, color: "text-parchment" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-5 py-16 animate-fade-in">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-sans text-parchment-muted uppercase tracking-widest mb-1">
            Admin
          </p>
          <h1 className="font-display text-4xl text-parchment">
            Welcome, {user?.username}
          </h1>
        </div>
        <Link to="/admin/posts/new">
          <Button>
            <PenLine size={16} /> New Essay
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-ink-soft border border-ink-muted rounded p-5">
            <Icon size={20} className={`${color} mb-3`} />
            <p className="font-display text-3xl text-parchment">{value}</p>
            <p className="text-xs font-sans text-parchment-muted uppercase tracking-wider mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/admin/posts" className="flex-1">
          <div className="border border-ink-muted rounded p-6 hover:border-amber-blog/50 transition-colors group">
            <TrendingUp size={20} className="text-amber-blog mb-3" />
            <h3 className="font-display text-xl text-parchment group-hover:text-amber-blog transition-colors">
              Manage Essays
            </h3>
            <p className="text-parchment-muted text-sm font-serif mt-1">
              View, edit, and delete all published and draft posts.
            </p>
          </div>
        </Link>
        <Link to="/admin/posts/new" className="flex-1">
          <div className="border border-ink-muted rounded p-6 hover:border-amber-blog/50 transition-colors group">
            <PenLine size={20} className="text-amber-blog mb-3" />
            <h3 className="font-display text-xl text-parchment group-hover:text-amber-blog transition-colors">
              Write New Essay
            </h3>
            <p className="text-parchment-muted text-sm font-serif mt-1">
              Compose and publish a new critical essay.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
