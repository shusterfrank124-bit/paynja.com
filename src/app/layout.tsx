import './globals.css';
import { headers } from 'next/headers';
import { LocaleProvider } from './locale-provider';
export const metadata = {
  title: 'Payinja | Global payments, without borders',
  description: 'A simpler way to send, receive and manage money across borders.'
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = headers().get('x-payinja-locale') || 'en-GB';
  return <html lang={locale}><body><LocaleProvider initialLocale={locale}>{children}</LocaleProvider></body></html>;
}
