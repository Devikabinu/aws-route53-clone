"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { login as apiLogin } from "@/lib/api";
import { ApiError } from "@/types/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const { token, isLoading, login } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Already logged in → go to console
  useEffect(() => {
    if (!isLoading && token) {
      router.replace("/hosted-zones");
    }
  }, [token, isLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const resp = await apiLogin({ username: username.trim(), password });
      login(resp.access_token, username.trim());
      addToast("success", `Welcome back, ${username.trim()}!`);
      router.replace("/hosted-zones");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) return null;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "var(--aws-bg)" }}
    >
      {/* Card */}
      <div
        className="w-full max-w-sm rounded-[var(--radius-lg)] shadow-xl overflow-hidden"
        style={{
          backgroundColor: "var(--aws-surface)",
          border: "1px solid var(--aws-border)",
        }}
      >
        {/* Header strip */}
        <div
          className="px-8 py-5 flex flex-col items-center gap-2"
          style={{ backgroundColor: "var(--aws-navy)" }}
        >
          {/* AWS logo mark */}
          <svg width="38" height="23" viewBox="0 0 28 17" fill="none" aria-hidden>
            <path
              d="M7.84 11.77c0 .28.03.5.09.68.07.17.16.36.28.56.05.08.07.16.07.23 0 .1-.06.2-.19.3l-.63.42a.48.48 0 01-.26.09c-.1 0-.2-.05-.3-.14a3.1 3.1 0 01-.35-.47 7.6 7.6 0 01-.3-.59c-.76.89-1.71 1.34-2.86 1.34-.82 0-1.47-.23-1.95-.7-.48-.47-.72-1.1-.72-1.88 0-.83.29-1.5.88-2.01.59-.51 1.37-.77 2.36-.77.33 0 .67.03 1.03.08.36.05.73.13 1.12.23v-.71c0-.74-.15-1.26-.46-1.56-.31-.3-.83-.45-1.57-.45-.34 0-.68.04-1.03.12a7.61 7.61 0 00-1.03.32c-.15.07-.27.1-.33.12a.7.7 0 01-.2.03c-.18 0-.27-.13-.27-.4v-.63c0-.21.03-.37.09-.46.06-.1.17-.2.33-.29.34-.17.74-.32 1.2-.43.47-.12.97-.18 1.49-.18 1.14 0 1.97.26 2.51.77.53.51.8 1.29.8 2.32v3.06zm-3.95 1.48c.32 0 .64-.06.99-.17.34-.12.65-.33.9-.62.15-.18.26-.38.32-.6.06-.22.1-.49.1-.8v-.39a7.7 7.7 0 00-.9-.17 7.39 7.39 0 00-.92-.06c-.65 0-1.13.13-1.44.38-.31.25-.47.6-.47 1.06 0 .43.11.75.34.97.23.22.55.33.98.33l.1.07zm7.77 1.04c-.23 0-.38-.04-.48-.13-.1-.08-.19-.27-.27-.52l-2.9-9.55c-.08-.25-.12-.42-.12-.51 0-.2.1-.31.3-.31h1.22c.24 0 .4.04.49.13.1.08.18.27.26.52l2.07 8.17 1.92-8.17c.07-.26.15-.44.24-.52.1-.08.27-.13.5-.13h1c.23 0 .39.04.49.13.09.08.18.27.24.52l1.95 8.27 2.13-8.27c.07-.25.16-.44.26-.52.1-.08.26-.13.49-.13h1.16c.2 0 .31.1.31.31 0 .06-.01.13-.03.2-.02.08-.06.19-.1.34L18.88 14.1c-.08.26-.16.44-.26.52-.1.09-.26.13-.48.13h-1.07c-.24 0-.4-.04-.49-.13-.1-.09-.18-.27-.25-.53l-1.9-7.9-1.89 7.89c-.08.26-.16.44-.25.53-.1.09-.27.13-.5.13h-1.07l-.04.07zm11.38.27c-.7 0-1.4-.08-2.08-.25-.68-.17-1.22-.35-1.58-.56a.97.97 0 01-.4-.35.9.9 0 01-.12-.45v-.66c0-.27.1-.4.3-.4.08 0 .15.01.23.04.07.03.18.08.3.13.4.18.85.32 1.32.42.47.1.93.15 1.4.15.74 0 1.32-.13 1.72-.38.4-.25.61-.62.61-1.09 0-.32-.1-.59-.3-.8-.2-.22-.58-.41-1.14-.6l-1.64-.51c-.83-.26-1.44-.64-1.83-1.14a2.7 2.7 0 01-.57-1.67c0-.48.1-.91.31-1.28.2-.37.48-.69.83-.95.35-.27.75-.47 1.22-.61.47-.14.97-.2 1.5-.2.26 0 .53.01.79.05.27.03.52.08.76.14.24.05.46.12.67.2.21.07.38.15.5.22.17.1.3.2.38.31.08.1.12.23.12.4v.6c0 .27-.1.41-.3.41a1.39 1.39 0 01-.5-.17 5.97 5.97 0 00-2.5-.53c-.68 0-1.21.1-1.58.33-.37.22-.56.57-.56 1.04 0 .32.11.6.34.82.22.22.64.44 1.24.63l1.6.51c.82.26 1.41.62 1.77 1.1.36.47.54 1.01.54 1.6 0 .5-.1.95-.3 1.35-.2.4-.49.75-.86 1.03-.37.28-.81.49-1.33.63-.54.15-1.1.22-1.71.22z"
              fill="#FF9900"
            />
          </svg>
          <p className="text-white text-xs font-light tracking-widest uppercase opacity-70">
            Management Console
          </p>
          <h1 className="text-white text-lg font-semibold">
            Route&nbsp;53
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-4">
          <Input
            id="login-username"
            label="IAM username"
            required
            autoComplete="username"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={submitting}
          />
          <Input
            id="login-password"
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            error={error || undefined}
          />

          <Button
            id="login-submit"
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
            className="w-full mt-1"
          >
            Sign in
          </Button>
        </form>

        {/* Footer hint */}
        <div
          className="px-8 pb-5 text-center text-xs"
          style={{ color: "var(--aws-text-muted)" }}
        >
          Default credentials:&nbsp;
          <code className="mono font-semibold text-[var(--aws-text)]">admin&nbsp;/&nbsp;password</code>
        </div>
      </div>

      {/* Copyright */}
      <p className="mt-6 text-xs" style={{ color: "var(--aws-text-muted)" }}>
        © {new Date().getFullYear()} AWS Route 53 Clone
      </p>
    </div>
  );
}
