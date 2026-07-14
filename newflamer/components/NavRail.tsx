"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Sticky navigation rail, pinned mid-left. Labels slide open on hover and
 * stay open on the active page; icons redraw their strokes on hover. On
 * narrow screens the rail docks to the bottom as a pill.
 */
export default function NavRail() {
  const pathname = usePathname();

  /* whatever page we land on, make sure the transition veil lifts */
  useEffect(() => {
    const veil = document.querySelector<HTMLElement>(".veil");
    if (veil) veil.style.opacity = "0";
  }, [pathname]);

  const links = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path className="icon-draw" d="M3 11.5 12 4l9 7.5" />
          <path className="icon-draw icon-draw-2" d="M5.5 10.5V20h13v-9.5" />
          <path className="icon-draw icon-draw-3" d="M9.5 20v-6h5v6" />
        </svg>
      ),
    },
    {
      href: "/blog/",
      label: "Blog",
      active: pathname.startsWith("/blog"),
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path className="icon-draw" d="M6 3.5h9l3.5 3.5v13.5h-12.5z" />
          <path className="icon-draw icon-draw-2" d="M9 9.5h6" />
          <path className="icon-draw icon-draw-2" d="M9 13h6" />
          <path className="icon-draw icon-draw-3" d="M9 16.5h4" />
        </svg>
      ),
    },
  ];

  const toggleTheme = () => {
    const el = document.documentElement;
    const next = el.dataset.theme === "light" ? "dark" : "light";
    el.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <nav className="nav-rail" aria-label="Primary">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`rail-link${l.active ? " is-active" : ""}`}
          aria-current={l.active ? "page" : undefined}
        >
          {l.icon}
          <span className="rail-label">
            <span className="rail-label-in">{l.label}</span>
          </span>
        </Link>
      ))}

      <button
        type="button"
        className="rail-link theme-btn"
        aria-label="Toggle light / dark theme"
        onClick={toggleTheme}
      >
        {/* CSS decides which icon shows, so SSR markup is theme-agnostic */}
        <svg
          className="icon-sun"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle className="icon-draw" cx="12" cy="12" r="4.2" />
          <path
            className="icon-draw icon-draw-2"
            d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7"
          />
        </svg>
        <svg
          className="icon-moon"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path
            className="icon-draw"
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"
          />
        </svg>
        <span className="rail-label">
          <span className="rail-label-in">Theme</span>
        </span>
      </button>
    </nav>
  );
}
