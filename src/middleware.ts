import { NextRequest, NextResponse } from 'next/server';
const countryLocale: Record<string,string> = {
 GB:'en-GB',US:'en-US',CA:'en-CA',AU:'en-AU',NZ:'en-GB',NG:'en-GB',PH:'fil',TH:'th',MY:'ms',ID:'id',CN:'zh-CN',TW:'zh-TW',HK:'zh-TW',IN:'hi',PK:'ur',BD:'bn',ES:'es',MX:'es',AR:'es',PT:'pt',BR:'pt-BR',IT:'it',DE:'de',AT:'de',CH:'de',FR:'fr',BE:'fr',NL:'nl',SA:'ar',AE:'ar',JP:'ja',KR:'ko',VN:'vi',RU:'ru',TR:'tr',PL:'pl',UA:'uk',SE:'sv',NO:'no',DK:'da',FI:'fi',GR:'el',CZ:'cs',HU:'hu',RO:'ro',IL:'he',KE:'sw',TZ:'sw'
};
const supported = new Set(['en-GB','en-US','en-CA','en-AU','fil','th','ms','id','zh-CN','zh-TW','hi','ur','bn','es','pt','pt-BR','it','de','fr','nl','ar','ja','ko','vi','ru','tr','pl','uk','sv','no','da','fi','el','cs','hu','ro','he','sw']);
export function middleware(request: NextRequest) {
 const response=NextResponse.next();
 const saved=request.cookies.get('payinja_locale')?.value;
 const country=(request.headers.get('x-vercel-ip-country')||'').toUpperCase();
 const browser=(request.headers.get('accept-language')||'').split(',')[0]?.split(';')[0]?.trim();
 const candidate=saved||countryLocale[country]||browser||'en-GB';
 const locale=supported.has(candidate)?candidate:(countryLocale[country]||'en-GB');
 response.headers.set('x-payinja-locale',locale);
 if(!saved) response.cookies.set('payinja_locale',locale,{path:'/',maxAge:31536000,sameSite:'lax'});
 return response;
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};