import { formatDistanceToNow, format } from "date-fns";

export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMMM d, yyyy");
}

export function avatarUrl(path: string | null, username: string): string {
  if (path) return path;
  // Fallback to a simple letter avatar URL using DiceBear
  const seed = encodeURIComponent(username);
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=C8833A&textColor=0C0B09`;
}

export function getApiError(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const resp = (error as { response?: { data?: unknown } }).response;
    if (resp?.data) {
      const data = resp.data as Record<string, unknown>;
      const messages = Object.entries(data)
        .map(([key, val]) => {
          if (Array.isArray(val)) return `${key}: ${val.join(", ")}`;
          if (typeof val === "string") return `${key}: ${val}`;
          return null;
        })
        .filter(Boolean);
      if (messages.length) return messages.join(" | ");
    }
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}
