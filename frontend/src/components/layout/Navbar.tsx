import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Feather, LogOut, LayoutDashboard, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { avatarUrl } from "../../utils";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setProfileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-ink/95 backdrop-blur-sm border-b border-ink-muted" : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-5 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <Feather
            size={20}
            className="text-amber-blog group-hover:rotate-12 transition-transform duration-300"
          />
          <span className="font-display text-xl text-parchment tracking-tight">
            Bible<span className="text-amber-blog">Critique</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-sans transition-colors ${
                isActive ? "text-parchment" : "text-parchment-muted hover:text-parchment"
              }`
            }
            end
          >
            Essays
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-sm font-sans transition-colors ${
                isActive ? "text-parchment" : "text-parchment-muted hover:text-parchment"
              }`
            }
          >
            About
          </NavLink>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src={avatarUrl(user.avatar, user.username)}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover border border-ink-muted"
                />
                <span className="text-sm font-sans text-parchment-muted">{user.username}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-ink-soft border border-ink-muted rounded shadow-xl py-1">
                  {user.is_admin && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-sans text-parchment-muted hover:text-parchment hover:bg-ink-muted transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-sans text-parchment-muted hover:text-crimson-light hover:bg-ink-muted transition-colors"
                  >
                    <LogOut size={14} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-sans text-parchment-muted hover:text-parchment transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-sans bg-amber-blog text-ink px-4 py-1.5 rounded hover:bg-amber-light transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-parchment-muted hover:text-parchment transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-ink-soft border-t border-ink-muted animate-slide-up">
          <div className="px-5 py-4 space-y-4">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block text-parchment-muted hover:text-parchment font-sans text-base"
            >
              Essays
            </Link>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="block text-parchment-muted hover:text-parchment font-sans text-base"
            >
              About
            </Link>
            {isAuthenticated ? (
              <>
                {user?.is_admin && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="block text-parchment-muted hover:text-parchment font-sans text-base"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block text-crimson-light font-sans text-base"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-parchment-muted hover:text-parchment font-sans text-base"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block text-amber-blog font-sans text-base"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
