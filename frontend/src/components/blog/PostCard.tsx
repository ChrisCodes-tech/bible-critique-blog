import React from "react";
import { Link } from "react-router-dom";
import { Clock, Eye, MessageSquare } from "lucide-react";
import type { PostSummary } from "../../types";
import { formatDate, avatarUrl } from "../../utils";
import TagBadge from "./TagBadge";

interface Props {
  post: PostSummary;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: Props) {
  return (
    <article
      className={`
        group relative flex flex-col border border-ink-muted
        hover:border-amber-blog/50 transition-all duration-300
        ${featured ? "md:flex-row" : ""}
      `}
    >
      {/* Cover image */}
      {post.cover_image && (
        <Link
          to={`/posts/${post.slug}`}
          className={`
            block overflow-hidden flex-shrink-0
            ${featured ? "md:w-2/5 h-60 md:h-auto" : "h-48"}
          `}
        >
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      )}

      {/* Content */}
      <div className="flex flex-col p-6 flex-1 gap-3">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}

        {/* Title */}
        <Link to={`/posts/${post.slug}`}>
          <h2
            className={`
              font-display text-parchment leading-tight
              group-hover:text-amber-blog transition-colors duration-200
              ${featured ? "text-3xl md:text-4xl" : "text-2xl"}
            `}
          >
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-parchment-muted text-base leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="mt-auto pt-4 border-t border-ink-muted flex items-center justify-between flex-wrap gap-3">
          {/* Author */}
          <div className="flex items-center gap-2">
            <img
              src={avatarUrl(post.author.avatar, post.author.username)}
              alt={post.author.username}
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="text-sm text-parchment-muted font-sans">
              {post.author.username}
            </span>
            <span className="text-ink-muted">·</span>
            <span className="text-sm text-parchment-muted font-sans">
              {formatDate(post.created_at)}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-parchment-muted text-sm font-sans">
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {post.reading_time}m
            </span>
            <span className="flex items-center gap-1">
              <Eye size={13} />
              {post.views}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={13} />
              {post.comment_count}
            </span>
          </div>
        </div>
      </div>

      {/* Draft indicator */}
      {post.status === "draft" && (
        <span className="absolute top-3 right-3 bg-ink-muted text-parchment-muted text-xs font-sans uppercase tracking-widest px-2 py-0.5 rounded-sm">
          Draft
        </span>
      )}
    </article>
  );
}
