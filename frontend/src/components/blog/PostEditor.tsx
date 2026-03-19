import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Image } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { Input, Textarea } from "../ui/Input";
import { postsApi } from "../../api/posts";
import { getApiError } from "../../utils";
import type { PostDetail, Tag } from "../../types";

interface Props {
  post?: PostDetail;
}

export default function PostEditor({ post }: Props) {
  const navigate = useNavigate();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");
  const [tags, setTags] = useState<Tag[]>(post?.tags ?? []);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(post?.cover_image ?? null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    postsApi.tags().then(({ data }) => setAllTags(Array.isArray(data) ? data : []));
  }, []);

  const toggleTag = (tag: Tag) => {
    setTags((prev) =>
      prev.find((t) => t.id === tag.id)
        ? prev.filter((t) => t.id !== tag.id)
        : [...prev, tag]
    );
  };

  const handleAddTag = async () => {
    const name = newTagName.trim();
    if (!name) return;
    try {
      const { data } = await postsApi.createTag(name);
      setAllTags((prev) => [...prev, data]);
      setTags((prev) => [...prev, data]);
      setNewTagName("");
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Title and body are required.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("body", body);
      fd.append("excerpt", excerpt);
      fd.append("status", status);
      tags.forEach((t) => fd.append("tag_ids", String(t.id)));
      if (coverFile) fd.append("cover_image", coverFile);

      if (isEdit) {
        await postsApi.update(post.slug, fd);
        toast.success("Post updated.");
      } else {
        await postsApi.create(fd);
        toast.success("Post created.");
      }
      navigate("/admin/posts");
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title */}
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a compelling title…"
        required
      />

      {/* Excerpt */}
      <Textarea
        label="Excerpt (optional — auto-generated if blank)"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="A brief summary shown on the listing page…"
        rows={3}
      />

      {/* Body */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-parchment-muted font-sans tracking-wide uppercase">
          Body <span className="text-crimson-light">*</span>
        </label>
        <p className="text-xs text-parchment-muted font-sans mb-1">
          Supports basic HTML: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;blockquote&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, &lt;code&gt;, &lt;hr&gt;
        </p>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your post here. You may use HTML for rich formatting…"
          rows={18}
          className="w-full bg-ink-soft border border-ink-muted rounded px-4 py-3 text-parchment placeholder-parchment-muted focus:outline-none focus:border-amber-blog transition-colors font-mono text-sm resize-y"
          required
        />
      </div>

      {/* Cover image */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-parchment-muted font-sans tracking-wide uppercase">
          Cover Image
        </label>
        {coverPreview && (
          <div className="relative w-full h-48 overflow-hidden rounded">
            <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => { setCoverPreview(null); setCoverFile(null); }}
              className="absolute top-2 right-2 bg-ink/80 text-parchment rounded-full p-1 hover:bg-ink"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <label className="flex items-center gap-3 cursor-pointer border border-dashed border-ink-muted rounded px-4 py-4 hover:border-amber-blog transition-colors">
          <Image size={20} className="text-parchment-muted" />
          <span className="text-parchment-muted text-sm font-sans">
            {coverFile ? coverFile.name : "Click to upload cover image…"}
          </span>
          <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
        </label>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-parchment-muted font-sans tracking-wide uppercase">Tags</label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const active = !!tags.find((t) => t.id === tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`text-xs font-sans uppercase tracking-widest px-3 py-1.5 rounded-sm border transition-colors ${
                  active
                    ? "border-amber-blog bg-amber-blog/10 text-amber-blog"
                    : "border-ink-muted text-parchment-muted hover:border-amber-blog hover:text-amber-blog"
                }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
        {/* Create new tag */}
        <div className="flex gap-2">
          <input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            placeholder="New tag name…"
            className="flex-1 bg-ink-soft border border-ink-muted rounded px-3 py-2 text-parchment text-sm placeholder-parchment-muted focus:outline-none focus:border-amber-blog transition-colors font-sans"
          />
          <Button type="button" variant="secondary" size="sm" onClick={handleAddTag}>
            <Plus size={14} /> Add
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-parchment-muted font-sans tracking-wide uppercase">Status</label>
        <div className="flex gap-3">
          {(["draft", "published"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-5 py-2 rounded-sm border text-sm font-sans uppercase tracking-widest transition-colors ${
                status === s
                  ? "border-amber-blog bg-amber-blog/10 text-amber-blog"
                  : "border-ink-muted text-parchment-muted hover:border-parchment-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-ink-muted">
        <Button type="submit" loading={loading}>
          {isEdit ? "Save Changes" : "Publish Post"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
