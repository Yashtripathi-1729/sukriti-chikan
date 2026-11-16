"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Simple password check — stored in sessionStorage
    // Real auth happens server-side on API calls
    if (password) {
      sessionStorage.setItem("admin_pass", password);
      router.push("/admin");
    } else {
      setError("Please enter password");
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
          className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-chikan-300"
        />
        <button
          type="submit"
          className="w-full bg-chikan-700 hover:bg-chikan-800 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
