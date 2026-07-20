"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "../components/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const loadingId = toast.loading("Signing in...", "Please wait");
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);
    toast.dismiss(loadingId);

    if (!result) {
      setError("Unable to sign in. Please try again.");
      toast.error("Unable to sign in. Please try again.");
      return;
    }

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
      return;
    }

    toast.success("Signed in successfully.");
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-mist px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-bold text-ink">Admin Login</h1>
        <p className="mt-2 text-sm text-steel">
          Enter your email and password to access the admin dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}

          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-ink">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                placeholder="admin@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                placeholder="Enter your password"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
