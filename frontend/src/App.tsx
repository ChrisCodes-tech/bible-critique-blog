import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import Home from "./pages/Home";
import PostDetailPage from "./pages/PostDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Admin
import AdminGuard from "./pages/admin/AdminGuard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPostList from "./pages/admin/PostList";
import { NewPost, EditPost } from "./pages/admin/PostEdit";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1A1916",
              color: "#F2EDE4",
              border: "1px solid #2E2C28",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#C8833A", secondary: "#0C0B09" } },
            error: { iconTheme: { primary: "#8B2020", secondary: "#F2EDE4" } },
          }}
        />

        <Routes>
          <Route element={<Layout />}>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/posts/:slug" element={<PostDetailPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin (staff-only) */}
            <Route element={<AdminGuard />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/posts" element={<AdminPostList />} />
              <Route path="/admin/posts/new" element={<NewPost />} />
              <Route path="/admin/posts/:slug/edit" element={<EditPost />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
