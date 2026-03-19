import React from "react";
import type { Tag } from "../../types";

interface Props {
  tag: Tag;
  onClick?: () => void;
  active?: boolean;
}

export default function TagBadge({ tag, onClick, active = false }: Props) {
  return (
    <span
      onClick={onClick}
      className={`
        inline-block text-xs font-sans uppercase tracking-widest px-2.5 py-1 rounded-sm
        border transition-colors duration-150
        ${onClick ? "cursor-pointer" : ""}
        ${
          active
            ? "border-amber-blog bg-amber-blog/10 text-amber-blog"
            : "border-ink-muted text-parchment-muted hover:border-amber-blog hover:text-amber-blog"
        }
      `}
    >
      {tag.name}
    </span>
  );
}
