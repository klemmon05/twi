"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit() {
    const res = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
    if (!res.ok) return setError("Invalid password");
    router.push("/admin");
    router.refresh();
  }

  return <div className="card max-w-md space-y-3"><h1 className="text-xl">Admin sign in</h1><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full rounded bg-slate-900 p-2" /><button onClick={submit} className="rounded bg-blue-600 px-3 py-2">Sign in</button>{error && <p className="text-red-400">{error}</p>}</div>;
}
