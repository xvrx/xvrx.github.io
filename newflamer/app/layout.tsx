import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import NavRail from "@/components/NavRail";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Beyond Entropy",
    template: "%s — Beyond Entropy",
  },
  description:
    "Field dossier of azrael — impulsive thoughts, proposals, and applied bullshitology from 1.1608°N, 104.0108°E.",
  icons: {
    icon: "https://avatars.githubusercontent.com/u/85608673?s=400&u=c2ee040195b1c9c08fdb687e9461b202a9b86cd2&v=4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${serif.variable} ${mono.variable}`}
      >
        {/* gates entrance animations (no JS = nothing hidden) and restores
            the saved theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
        <header className="site-header">
          <Link href="/" className="wordmark">
            <span className="wordmark-sigil">⌖</span> AZRAEL&thinsp;/&thinsp;BEYOND&nbsp;ENTROPY
          </Link>
        </header>
        <NavRail />
        {children}
        {/* route-transition veil: exit fades it in, the next page lifts it */}
        <div className="veil" aria-hidden="true" />
      </body>
    </html>
  );
}
