import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Feather } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import Button from "../components/ui/Button";
import { getApiError } from "../utils";

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "", password2: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (isAuthenticated) { navigate("/"); return null; }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.username.trim()) errs.username = "Username is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (form.password !== form.password2) errs.password2 = "Passwords do not match.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created! Welcome aboard.");
      navigate("/");
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-20">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-10">
          <Feather size={28} className="text-amber-blog mx-auto mb-3" />
          <h1 className="font-display text-4xl text-parchment">Create an account</h1>
          <p className="text-parchment-muted font-serif mt-2">
            Join the scholarly conversation.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-ink-soft border border-ink-muted rounded p-8 space-y-5"
        >
          <Input
            label="Username"
            value={form.username}
            onChange={set("username")}
            placeholder="scholarknight"
            error={errors.username}
            autoComplete="username"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            error={errors.email}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="At least 8 characters"
            error={errors.password}
            autoComplete="new-password"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={form.password2}
            onChange={set("password2")}
            placeholder="Repeat password"
            error={errors.password2}
            autoComplete="new-password"
          />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Create Account
          </Button>
        </form>

        <p className="text-center text-parchment-muted font-sans text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-blog hover:text-amber-light underline underline-offset-2">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
