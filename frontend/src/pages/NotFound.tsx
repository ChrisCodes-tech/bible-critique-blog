import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center animate-fade-in">
      <p className="font-display text-8xl text-ink-muted mb-4 select-none">404</p>
      <h1 className="font-display text-3xl text-parchment mb-3">Page not found</h1>
      <p className="text-parchment-muted font-serif mb-8">
        The page you're looking for has been lost to the sands of time.
      </p>
      <Link
        to="/"
        className="text-amber-blog hover:text-amber-light underline underline-offset-2 font-sans text-sm"
      >
        ← Return to Essays
      </Link>
    </div>
  );
}
