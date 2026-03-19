import React, { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

const baseClass = `
  w-full bg-ink-soft border border-ink-muted rounded
  px-4 py-3 text-parchment placeholder-parchment-muted
  focus:outline-none focus:border-amber-blog
  transition-colors duration-150
  font-serif text-base
`;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm text-parchment-muted font-sans tracking-wide uppercase">
          {label}
        </label>
      )}
      <input className={`${baseClass} ${error ? "border-crimson-blog" : ""} ${className}`} {...props} />
      {error && <p className="text-crimson-light text-sm">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm text-parchment-muted font-sans tracking-wide uppercase">
          {label}
        </label>
      )}
      <textarea
        className={`${baseClass} resize-y min-h-[120px] ${error ? "border-crimson-blog" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-crimson-light text-sm">{error}</p>}
    </div>
  );
}
