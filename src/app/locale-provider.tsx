"use client";
import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from "react";
import {supabase} from "../lib/supabase";
import {tr} from "./dashboard-translations";
export const PAYINJA_LOCALES=[
 ["en-GB","English (UK)"],["en-US","English (US)"],["en-CA","English (Canada)"],["en-AU","English (Australia)"],["fil","Filipino"],["th","ไทย"],["ms","Bahasa Melayu"],["id","Bahasa Indonesia"],["zh-CN","简体中文"],["zh-TW","繁體中文"],["hi","हिन्दी"],["ur","اردو"],["bn","বাংলা"],["es","Español"],["pt","Português"],["pt-BR","Português (Brasil)"],["it","Italiano"],["de","Deutsch"],["fr","Français"],["nl","Nederlands"],["ar","العربية"],["ja","日本語"],["ko","한국어"],["vi","Tiếng Việt"],["ru","Русский"],["tr","Türkçe"],["pl","Polski"],["uk","Українська"],["sv","Svenska"],["no","Norsk"],["da","Dansk"],["fi","Suomi"],["el","Ελληνικά"],["cs","Čeština"],["hu","Magyar"],["ro","Română"],["he","עברית"],["sw","Kiswahili"]
] as const;
type Locale=typeof PAYINJA_LOCALES[number][0];
type LocaleContextValue={locale:string;setLocale:(locale:string)=>Promise<void>;ready:boolean};
const LocaleContext=createContext<LocaleContextValue>({locale:"en-GB",setLocale:async()=>{},ready:false});
function translateDocument(locale:string){
 const originals=new WeakMap<Text,string>();
 const translateNode=(node:Node)=>{
  if(node.nodeType===Node.TEXT_NODE){
   const textNode=node as Text;
   const original=originals.get(textNode)??textNode.nodeValue??"";
   if(!original.trim())return;
   originals.set(textNode,original);
   const translated=tr(locale,original);
   if(textNode.nodeValue!==translated)textNode.nodeValue=translated;
  } else if(node instanceof HTMLElement){
   if(["SCRIPT","STYLE","NOSCRIPT"].includes(node.tagName))return;
   for(const attr of ["placeholder","aria-label","title"]){const value=node.getAttribute(attr);if(value){const key="data-payinja-original-"+attr;if(!node.hasAttribute(key))node.setAttribute(key,value);const source=node.getAttribute(key)||value;node.setAttribute(attr,tr(locale,source));}}
   node.childNodes.forEach(translateNode);
  }
 };
 const root=document.body;
 root.childNodes.forEach(translateNode);
 const observer=new MutationObserver(records=>records.forEach(record=>{record.addedNodes.forEach(translateNode);if(record.type==="characterData")translateNode(record.target);}));
 observer.observe(root,{subtree:true,childList:true,characterData:true});
 return()=>observer.disconnect();
}
function writeCookie(locale:string){document.cookie=`payinja_locale=${encodeURIComponent(locale)}; Path=/; Max-Age=31536000; SameSite=Lax`;document.documentElement.lang=locale;document.documentElement.dir=["ar","he","ur"].includes(locale)?"rtl":"ltr";}
export function LocaleProvider({initialLocale,children}:{initialLocale:string;children:ReactNode}){
 const [locale,setLocaleState]=useState<string>(initialLocale||"en-GB");
 const [ready,setReady]=useState(false);
 useEffect(()=>translateDocument(locale),[locale]);
 useEffect(()=>{
  let alive=true;
  const sync=async()=>{
   const {data:{user}}=await supabase.auth.getUser();
   if(!alive)return;
   if(user){
    const {data}=await supabase.from("profiles").select("preferred_language").eq("id",user.id).maybeSingle();
    if(!alive)return;
    const preferred=data?.preferred_language;
    if(preferred&&PAYINJA_LOCALES.some(x=>x[0]===preferred)){setLocaleState(preferred);writeCookie(preferred);}
    else {const cookie=document.cookie.split("; ").find(x=>x.startsWith("payinja_locale="))?.split("=")[1];const selected=cookie?decodeURIComponent(cookie):locale; if(PAYINJA_LOCALES.some(x=>x[0]===selected)){setLocaleState(selected);writeCookie(selected);await supabase.from("profiles").update({preferred_language:selected}).eq("id",user.id);}}
   } else {
    const cookie=document.cookie.split("; ").find(x=>x.startsWith("payinja_locale="))?.split("=")[1];
    if(cookie){const selected=decodeURIComponent(cookie);if(PAYINJA_LOCALES.some(x=>x[0]===selected)){setLocaleState(selected);writeCookie(selected);}}
   }
   setReady(true);
  };
  sync();
  const {data:{subscription}}=supabase.auth.onAuthStateChange(()=>{void sync();});
  return()=>{alive=false;subscription.unsubscribe();};
 },[]);
 const setLocale=async(next:string)=>{
  if(!PAYINJA_LOCALES.some(x=>x[0]===next))return;
  setLocaleState(next);writeCookie(next);
  const {data:{user}}=await supabase.auth.getUser();
  if(user){
   const {error}=await supabase.from("profiles").update({preferred_language:next}).eq("id",user.id);
   if(error)console.error("Could not save account language preference:",error.message);
  }
 };
 const value=useMemo(()=>({locale,setLocale,ready}),[locale,ready]);
 return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
export function usePayinjaLocale(){return useContext(LocaleContext);}
export function LanguageSelect({compact=false}:{compact?:boolean}){
 const {locale,setLocale}=usePayinjaLocale();
 return <label className={compact?"flex items-center gap-2 text-xs text-slate-400":"flex items-center gap-2 text-sm text-slate-300"}><span aria-hidden="true">◎</span><span className="sr-only">Application language</span><select aria-label="Application language" value={locale} onChange={e=>{void setLocale(e.target.value);}} className="max-w-[150px] rounded-xl border border-white/10 bg-[#0b1726] px-2.5 py-2 text-xs text-slate-100 outline-none focus:border-cyan-300/50">{PAYINJA_LOCALES.map(([code,name])=><option key={code} value={code}>{name}</option>)}</select></label>;
}
