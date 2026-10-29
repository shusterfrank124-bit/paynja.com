"use client";
import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from "react";
export const PAYINJA_LOCALES=[
 ["en-GB","English (UK)"],["en-US","English (US)"],["en-CA","English (Canada)"],["en-AU","English (Australia)"],["fil","Filipino"],["th","ไทย"],["ms","Bahasa Melayu"],["id","Bahasa Indonesia"],["zh-CN","简体中文"],["zh-TW","繁體中文"],["hi","हिन्दी"],["ur","اردو"],["bn","বাংলা"],["es","Español"],["pt","Português"],["pt-BR","Português (Brasil)"],["it","Italiano"],["de","Deutsch"],["fr","Français"],["nl","Nederlands"],["ar","العربية"],["ja","日本語"],["ko","한국어"],["vi","Tiếng Việt"],["ru","Русский"],["tr","Türkçe"],["pl","Polski"],["uk","Українська"],["sv","Svenska"],["no","Norsk"],["da","Dansk"],["fi","Suomi"],["el","Ελληνικά"],["cs","Čeština"],["hu","Magyar"],["ro","Română"],["he","עברית"],["sw","Kiswahili"]
] as const;
type Locale=typeof PAYINJA_LOCALES[number][0];
type LocaleContextValue={locale:string;setLocale:(locale:string)=>void};
const LocaleContext=createContext<LocaleContextValue>({locale:"en-GB",setLocale:()=>{}});
export function LocaleProvider({initialLocale,children}:{initialLocale:string;children:ReactNode}){
 const [locale,setLocaleState]=useState(initialLocale);
 useEffect(()=>{const saved=document.cookie.split("; ").find(x=>x.startsWith("payinja_locale="))?.split("=")[1];if(saved&&saved!==locale)setLocaleState(decodeURIComponent(saved));},[]);
 const setLocale=(next:string)=>{if(!PAYINJA_LOCALES.some(x=>x[0]===next))return;document.cookie=`payinja_locale=${encodeURIComponent(next)}; Path=/; Max-Age=31536000; SameSite=Lax`;setLocaleState(next);document.documentElement.lang=next;window.location.reload();};
 const value=useMemo(()=>({locale,setLocale}),[locale]);
 return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
export function usePayinjaLocale(){return useContext(LocaleContext);}
export function LanguageSelect({compact=false}:{compact?:boolean}){
 const {locale,setLocale}=usePayinjaLocale();
 return <label className={compact?"flex items-center gap-2 text-xs text-slate-400":"flex items-center gap-2 text-sm text-slate-300"}><span aria-hidden="true">◎</span><span className="sr-only">Application language</span><select aria-label="Application language" value={locale} onChange={e=>setLocale(e.target.value)} className="max-w-[150px] rounded-xl border border-white/10 bg-[#0b1726] px-2.5 py-2 text-xs text-slate-100 outline-none focus:border-cyan-300/50">{PAYINJA_LOCALES.map(([code,name])=><option key={code} value={code}>{name}</option>)}</select></label>;
}
