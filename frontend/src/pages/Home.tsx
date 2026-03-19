import React, { useEffect, useState, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { postsApi } from "../api/posts";
import type { PostSummary, Tag, PaginatedResponse } from "../types";
import PostCard from "../components/blog/PostCard";
import TagBadge from "../components/blog/TagBadge";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<PaginatedResponse<PostSummary> | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const activeTag = searchParams.get("tag") ?? "";

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page };
      if (search) params.search = search;
      if (activeTag) params["tags__slug"] = activeTag;
      const { data: result } = await postsApi.list(params as Parameters<typeof postsApi.list>[0]);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeTag]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    postsApi.tags().then(({ data }) => setTags(Array.isArray(data) ? data : []));
  }, []);

  const setParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  const featured = data?.results[0];
  const rest = data?.results.slice(1) ?? [];
  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  return (
    <div className="max-w-5xl mx-auto px-5 py-16 animate-fade-in">

      {/* Hero */}
      <div className="mb-16 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-amber-blog mb-4">
          Independent Biblical Scholarship
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-parchment font-light leading-tight mb-6">
          Question Everything.<br />
          <em className="text-amber-blog">Fearlessly.</em>
        </h1>
        <p className="text-parchment-muted text-lg max-w-xl mx-auto font-serif">
          A home for honest, rigorous inquiry into scripture, theology, and religious tradition — 
          free from dogma, open to reason.
        </p>
        <div className="w-16 h-px bg-amber-blog mx-auto mt-10" />
      </div>

      {/* Filters */}
      <div className="mb-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-parchment-muted" />
          <input
            value={search}
            onChange={(e) => setParam("search", e.target.value)}
            placeholder="Search essays…"
            className="w-full bg-ink-soft border border-ink-muted rounded pl-9 pr-4 py-2.5 text-parchment text-sm placeholder-parchment-muted focus:outline-none focus:border-amber-blog transition-colors font-sans"
          />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagBadge
                key={tag.id}
                tag={tag}
                active={activeTag === tag.slug}
                onClick={() => setParam("tag", activeTag === tag.slug ? "" : tag.slug)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Featured post */}
      {loading ? (
        <div className="space-y-6">
          <div className="skeleton w-full h-72 rounded" />
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-64 rounded" />)}
          </div>
        </div>
      ) : data?.results.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-3xl text-parchment-muted mb-3">No essays found</p>
          <p className="text-parchment-muted font-serif">Try a different search or tag.</p>
        </div>
      ) : (
        <>
          {featured && (
            <div className="mb-10">
              <PostCard post={featured} featured />
            </div>
          )}

          {rest.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                disabled={page <= 1}
                onClick={() => setParam("page", String(page - 1))}
                className="flex items-center gap-1 text-sm font-sans text-parchment-muted hover:text-parchment disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span className="text-sm font-sans text-parchment-muted">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setParam("page", String(page + 1))}
                className="flex items-center gap-1 text-sm font-sans text-parchment-muted hover:text-parchment disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
