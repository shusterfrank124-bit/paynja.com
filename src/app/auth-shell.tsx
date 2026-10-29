"use client";
import Link from "next/link";
import { ReactNode } from "react";
import {LanguageSelect} from "./locale-provider";
export default function AuthShell({children,title,subtitle}:{children:ReactNode,title:string,subtitle:string}) {
 return <main className="min-h-screen bg-[#050811] px-5 py-8 text-white sm:py-12"><div className="mx-auto max-w-md"><div className="flex items-center justify-between gap-3"><Link href="/" className="text-2xl font-bold">payinja<span className="text-cyan-300">.</span></Link><LanguageSelect compact/></div><div className="glass mt-8 rounded-3xl p-5 sm:p-9"><h1 className="text-3xl font-semibold">{title}</h1><p className="mt-2 text-sm text-slate-400">{subtitle}</p>{children}</div><p className="mt-8 text-center text-xs text-slate-500">© {new Date().getFullYear()} Payinja. Global payments, made clearer.</p></div></main>
}
