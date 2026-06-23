"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface GlobalNavProps {
  isActiveUser: boolean;
}

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/test/public", label: "Tes Publik" },
] as const;

export default function GlobalNav({ isActiveUser }: GlobalNavProps) {
  const pathname = usePathname();

  return (
    <header className="app-site-header">
      <div className="app-site-header-inner">
        <Link href="/" className="app-site-brand" aria-label="Asesmen Pendis Kutai Barat">
          <Image
            src="/pendis_logo.png"
            alt="Pendis"
            width={1772}
            height={597}
            priority
            className="app-site-brand-logo"
          />
          <span className="app-site-brand-title">Asesmen Pendis Kutai Barat</span>
        </Link>

        <nav className="app-site-nav" aria-label="Navigasi utama">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`app-site-nav-link ${isActive ? "app-site-nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href={isActiveUser ? "/admin/dashboard" : "/admin/login"}
            className="app-button-primary"
          >
            {isActiveUser ? "Dashboard" : "Login Admin"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
