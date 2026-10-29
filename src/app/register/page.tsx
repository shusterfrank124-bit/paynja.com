"use client";
import { FormEvent,useState } from "react";
import Link from "next/link";
import AuthShell from "../auth-shell";
import { supabase } from "../../lib/supabase";
export default function RegisterPage(){
 const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [busy,setBusy]=useState(false); const [message,setMessage]=useState("");
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setMessage("");
 const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name},emailRedirectTo:typeof window!=="undefined"?window.location.origin+"/login":undefined}});
 setBusy(false); if(error){setMessage(error.message);return;}
 setMessage(data.session?"Account created. Redirecting…":"Account created. Check your email to confirm your address, then sign in.");
 if(data.session) window.location.href="/dashboard";
 }
 return <AuthShell title="Create your Payinja account" subtitle="Register to access your personal payment dashboard."><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm">Full name<input required autoComplete="name" value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300"/></label><label className="block text-sm">Email address<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300"/></label><label className="block text-sm">Password<input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300"/><span className="mt-1 block text-xs text-slate-500">Use at least 8 characters.</span></label><button disabled={busy} className="cta w-full rounded-xl px-5 py-3 font-semibold disabled:opacity-50">{busy?"Creating account…":"Create account"}</button>{message&&<p role="status" className="text-sm text-cyan-200">{message}</p>}</form><p className="mt-6 text-sm text-slate-400">Already registered? <Link className="text-cyan-200" href="/login">Log in</Link></p></AuthShell>
}
