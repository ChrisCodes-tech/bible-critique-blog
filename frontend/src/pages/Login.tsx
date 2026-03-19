import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Feather } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import Button from "../components/ui/Button";
import { getApiError } from "../utils";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const errs: typeof errors = {};
    if (!email) errs.email = "Email is required.";
    if (!password) errs.password = "Password is required.";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await login({ email, password });
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-20">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Feather size={28} className="text-amber-blog mx-auto mb-3" />
          <h1 className="font-display text-4xl text-parchment">Welcome back</h1>
          <p className="text-parchment-muted font-serif mt-2">
            Sign in to join the discussion.
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-ink-soft border border-ink-muted rounded p-8 space-y-5"
        >
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            error={errors.email}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            autoComplete="current-password"
          />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Log In
          </Button>
        </form>

        <p className="text-center text-parchment-muted font-sans text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-amber-blog hover:text-amber-light underline underline-offset-2">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
