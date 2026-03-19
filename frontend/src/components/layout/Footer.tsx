import React from "react";
import { Link } from "react-router-dom";
import { Feather } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-ink-muted mt-24">
      <div className="max-w-5xl mx-auto px-5 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Feather size={16} className="text-amber-blog" />
          <span className="font-display text-lg text-parchment">
            Bible<span className="text-amber-blog">Critique</span>
          </span>
        </div>

        <p className="text-parchment-muted text-sm font-sans text-center">
          Honest inquiry into sacred texts — conducted respectfully, fearlessly.
        </p>

        <nav className="flex gap-6">
          <Link to="/" className="text-sm font-sans text-parchment-muted hover:text-parchment transition-colors">
            Essays
          </Link>
          <Link to="/about" className="text-sm font-sans text-parchment-muted hover:text-parchment transition-colors">
            About
          </Link>
        </nav>
      </div>
      <div className="border-t border-ink-muted py-4 text-center">
        <p className="text-xs text-parchment-muted font-sans">
          © {new Date().getFullYear()} BibleCritique. All content is opinion and scholarly commentary.
        </p>
      </div>
    </footer>
  );
}
