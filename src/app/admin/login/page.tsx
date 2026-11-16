"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return setError("Please enter password");

    setChecking(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "x-admin-password": password },
      });
      if (!res.ok) {
        setError(res.status === 401 ? "Wrong password" : "Could not log in, try again");
        return;
      }
      sessionStorage.setItem("admin_pass", password);
      router.push("/admin");
    } catch {
      setError("Network error, try again");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-serif font-bold text-chikan-800 mb-6 text-center">
          Admin Login
        </h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          autoFocus
          className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-chikan-300"
        />
        <button
          type="submit"
          disabled={checking}
          className="w-full bg-chikan-700 hover:bg-chikan-800 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {checking ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
}
