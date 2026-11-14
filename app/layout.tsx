import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Swipe to Help | One swipe can start something good', description: 'Discover assistance stories and startup ideas, create an account and submit ideas for review. Early-access preview; no financial transactions.', applicationName:'Swipe to Help', manifest:'/manifest.webmanifest', appleWebApp:{capable:true,title:'Swipe to Help',statusBarStyle:'black-translucent'}, openGraph:{title:'Swipe to Help',description:'One swipe can start something good.',siteName:'Swipe to Help',url:'https://swipetohelp.app',type:'website'} };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
