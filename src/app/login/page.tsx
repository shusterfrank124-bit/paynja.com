"use client";
import { FormEvent,useState } from "react";
import Link from "next/link";
import AuthShell from "../auth-shell";
import { supabase } from "../../lib/supabase";
export default function LoginPage(){
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setMessage("");const {error}=await supabase.auth.signInWithPassword({email,password});setBusy(false);if(error){setMessage(error.message);return;}window.location.href="/dashboard";}
 return <AuthShell title="Welcome back" subtitle="Log in to manage your Payinja account."><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm">Email address<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300"/></label><label className="block text-sm">Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300"/></label><button disabled={busy} className="cta w-full rounded-xl px-5 py-3 font-semibold disabled:opacity-50">{busy?"Signing in…":"Log in"}</button>{message&&<p role="alert" className="text-sm text-rose-300">{message}</p>}</form><p className="mt-6 text-sm text-slate-400">New to Payinja? <Link className="text-cyan-200" href="/register">Create an account</Link></p><p className="mt-4 text-xs text-slate-500"><Link href="/admin/login">Administrator access</Link></p></AuthShell>
}
