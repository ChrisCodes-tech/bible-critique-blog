import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { commentsApi } from "../../api/comments";
import { getApiError } from "../../utils";
import type { Comment } from "../../types";
import CommentItem from "./CommentItem";
import { Textarea } from "../ui/Input";
import Button from "../ui/Button";

interface Props {
  postId: number;
}

export default function CommentSection({ postId }: Props) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBody, setNewBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await commentsApi.list(postId);
      setComments(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Could not load comments.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCreate = async () => {
    if (!newBody.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await commentsApi.create(postId, newBody.trim());
      setComments((prev) => [...prev, data]);
      setNewBody("");
      toast.success("Comment posted.");
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: number, body: string) => {
    try {
      const { data } = await commentsApi.create(postId, body, parentId);
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...c.replies, { id: data.id, author: data.author, body: data.body, created_at: data.created_at, updated_at: data.updated_at }] }
            : c
        )
      );
      toast.success("Reply posted.");
    } catch (e) {
      toast.error(getApiError(e));
      throw e;
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await commentsApi.remove(commentId);
      // Remove from top-level or from replies
      setComments((prev) =>
        prev
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies.filter((r) => r.id !== commentId),
          }))
      );
      toast.success("Comment deleted.");
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  const handleUpdate = async (commentId: number, body: string) => {
    try {
      const { data } = await commentsApi.update(commentId, body);
      setComments((prev) =>
        prev
          .map((c) =>
            c.id === commentId ? { ...c, body: data.body, updated_at: data.updated_at } : c
          )
          .map((c) => ({
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId ? { ...r, body: data.body, updated_at: data.updated_at } : r
            ),
          }))
      );
    } catch (e) {
      toast.error(getApiError(e));
      throw e;
    }
  };

  return (
    <section className="mt-16 border-t border-ink-muted pt-12">
      {/* Section header */}
      <h2 className="font-display text-2xl text-parchment mb-8 flex items-center gap-3">
        <MessageSquare size={22} className="text-amber-blog" />
        Discussion
        {comments.length > 0 && (
          <span className="text-parchment-muted text-base font-serif font-normal">
            ({comments.length})
          </span>
        )}
      </h2>

      {/* Compose box */}
      {isAuthenticated ? (
        <div className="mb-10 space-y-3">
          <Textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder="Share your thoughts respectfully…"
            rows={4}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-parchment-muted font-sans">
              Commenting as <span className="text-parchment">{user?.username}</span>
            </p>
            <Button onClick={handleCreate} loading={submitting} size="sm">
              Post Comment
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-10 p-5 border border-ink-muted rounded text-center">
          <p className="text-parchment-muted text-base">
            <Link to="/login" className="text-amber-blog hover:text-amber-light underline underline-offset-2">
              Log in
            </Link>{" "}
            or{" "}
            <Link to="/register" className="text-amber-blog hover:text-amber-light underline underline-offset-2">
              create an account
            </Link>{" "}
            to join the discussion.
          </p>
        </div>
      )}

      {/* Comment list */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="skeleton w-9 h-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-32 rounded" />
                <div className="skeleton h-16 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-parchment-muted text-center py-10 italic font-serif">
          No comments yet. Be the first to engage.
        </p>
      ) : (
        <div className="space-y-8">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </section>
  );
}
