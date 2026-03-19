import React, { useState } from "react";
import { Reply, Trash2, Edit2, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { commentsApi } from "../../api/comments";
import { timeAgo, avatarUrl, getApiError } from "../../utils";
import type { Comment, Reply as ReplyType } from "../../types";
import { Textarea } from "../ui/Input";
import Button from "../ui/Button";

interface Props {
  comment: Comment;
  onReply: (parentId: number, body: string) => Promise<void>;
  onDelete: (commentId: number) => void;
  onUpdate: (commentId: number, body: string) => Promise<void>;
}

export default function CommentItem({ comment, onReply, onDelete, onUpdate }: Props) {
  const { user, isAuthenticated } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [editBody, setEditBody] = useState(comment.body);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canModify = user && (user.id === comment.author.id || user.is_admin);

  const handleReplySubmit = async () => {
    if (!replyBody.trim()) return;
    setSubmitting(true);
    try {
      await onReply(comment.id, replyBody.trim());
      setReplyBody("");
      setShowReplyForm(false);
      setShowReplies(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editBody.trim()) return;
    setSubmitting(true);
    try {
      await onUpdate(comment.id, editBody.trim());
      setIsEditing(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex gap-4">
        {/* Avatar */}
        <img
          src={avatarUrl(comment.author.avatar, comment.author.username)}
          alt={comment.author.username}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5"
        />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-sans font-medium text-parchment text-sm">
              {comment.author.username}
            </span>
            <span className="text-xs text-parchment-muted font-sans">
              {timeAgo(comment.created_at)}
            </span>
            {comment.created_at !== comment.updated_at && (
              <span className="text-xs text-parchment-muted italic font-sans">(edited)</span>
            )}
          </div>

          {/* Body or Edit form */}
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" loading={submitting} onClick={handleEditSubmit}>
                  <Check size={14} /> Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setIsEditing(false); setEditBody(comment.body); }}
                >
                  <X size={14} /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-parchment-soft text-base leading-relaxed whitespace-pre-wrap">
              {comment.body}
            </p>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="mt-2 flex items-center gap-4">
              {isAuthenticated && (
                <button
                  onClick={() => setShowReplyForm((v) => !v)}
                  className="flex items-center gap-1.5 text-xs font-sans text-parchment-muted hover:text-amber-blog transition-colors"
                >
                  <Reply size={13} />
                  Reply
                </button>
              )}
              {comment.replies.length > 0 && (
                <button
                  onClick={() => setShowReplies((v) => !v)}
                  className="text-xs font-sans text-parchment-muted hover:text-parchment transition-colors"
                >
                  {showReplies ? "Hide" : "Show"} {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                </button>
              )}
              {canModify && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-xs font-sans text-parchment-muted hover:text-parchment transition-colors"
                  >
                    <Edit2 size={13} />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="flex items-center gap-1 text-xs font-sans text-parchment-muted hover:text-crimson-light transition-colors"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </>
              )}
            </div>
          )}

          {/* Reply form */}
          {showReplyForm && (
            <div className="mt-4 space-y-2 animate-slide-up">
              <Textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder={`Replying to ${comment.author.username}…`}
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" loading={submitting} onClick={handleReplySubmit}>
                  Post Reply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setShowReplyForm(false); setReplyBody(""); }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {showReplies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4 pl-4 border-l border-ink-muted">
              {comment.replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  commentId={comment.id}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Inline reply item ────────────────────────────────────────────────────────
function ReplyItem({
  reply,
  commentId,
  onDelete,
  onUpdate,
}: {
  reply: ReplyType;
  commentId: number;
  onDelete: (id: number) => void;
  onUpdate: (id: number, body: string) => Promise<void>;
}) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(reply.body);
  const [submitting, setSubmitting] = useState(false);
  const canModify = user && (user.id === reply.author.id || user.is_admin);

  const handleSave = async () => {
    if (!editBody.trim()) return;
    setSubmitting(true);
    try {
      await onUpdate(reply.id, editBody.trim());
      setIsEditing(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex gap-3 animate-fade-in">
      <img
        src={avatarUrl(reply.author.avatar, reply.author.username)}
        alt={reply.author.username}
        className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-sans font-medium text-parchment text-sm">
            {reply.author.username}
          </span>
          <span className="text-xs text-parchment-muted font-sans">
            {timeAgo(reply.created_at)}
          </span>
        </div>
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <Textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={2} />
            <div className="flex gap-2">
              <Button size="sm" loading={submitting} onClick={handleSave}>
                <Check size={14} /> Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                <X size={14} /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-parchment-soft text-sm leading-relaxed whitespace-pre-wrap">
            {reply.body}
          </p>
        )}
        {!isEditing && canModify && (
          <div className="mt-1.5 flex gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-xs font-sans text-parchment-muted hover:text-parchment transition-colors"
            >
              <Edit2 size={12} /> Edit
            </button>
            <button
              onClick={() => onDelete(reply.id)}
              className="flex items-center gap-1 text-xs font-sans text-parchment-muted hover:text-crimson-light transition-colors"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
