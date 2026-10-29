"use client";
import { FormEvent,useState } from "react";
import Link from "next/link";
import AuthShell from "../../auth-shell";
import { supabase } from "../../../lib/supabase";
export default function AdminLogin(){
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setMessage("");const {error}=await supabase.auth.signInWithPassword({email,password});if(error){setBusy(false);setMessage(error.message);return;}const {data:{user}}=await supabase.auth.getUser();const {data:profile}=await supabase.from("profiles").select("role").eq("id",user?.id).single();if(profile?.role!=="admin"){await supabase.auth.signOut();setBusy(false);setMessage("This account does not have administrator access.");return;}window.location.href="/admin";}
 return <AuthShell title="Administrator sign in" subtitle="Restricted access for authorised Payinja administrators."><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm">Admin email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"/></label><label className="block text-sm">Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"/></label><button disabled={busy} className="cta w-full rounded-xl px-4 py-3 font-semibold">{busy?"Checking access…":"Sign in to admin"}</button>{message&&<p role="alert" className="text-sm text-rose-300">{message}</p>}</form><p className="mt-6 text-sm text-slate-400"><Link href="/login" className="text-cyan-200">Customer login</Link></p></AuthShell>
}
