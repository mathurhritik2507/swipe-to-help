import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Swipe to Help — Discover help and ideas', description: 'Discover community assistance requests and startup ideas. Preview only: no payments or investments.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
