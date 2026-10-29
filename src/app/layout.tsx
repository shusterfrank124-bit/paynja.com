import './globals.css';
import { headers } from 'next/headers';
export const metadata = {
  title: 'Payinja | Global payments, without borders',
  description: 'A simpler way to send, receive and manage money across borders.'
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = headers().get('x-payinja-locale') || 'en-GB';
  return <html lang={locale}><body>{children}</body></html>;
}