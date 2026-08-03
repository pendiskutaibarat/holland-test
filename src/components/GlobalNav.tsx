"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminProfileMenu from "@/components/admin/AdminProfileMenu";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/test/public", label: "Tes Publik" },
] as const;

export default function GlobalNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminOrGuruLoggedIn, setIsAdminOrGuruLoggedIn] = useState(false);
  const [activeUserEmail, setActiveUserEmail] = useState<string | null>(null);

  function isNavActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadAuthState() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as {
          isAdminOrGuruLoggedIn?: boolean;
          activeUserEmail?: string | null;
        };

        setIsAdminOrGuruLoggedIn(Boolean(data.isAdminOrGuruLoggedIn));
        setActiveUserEmail(data.activeUserEmail ?? null);
      } catch {
        if (!controller.signal.aborted) {
          setIsAdminOrGuruLoggedIn(false);
          setActiveUserEmail(null);
        }
      }
    }

    void loadAuthState();

    return () => controller.abort();
  }, []);

  return (
    <header className="app-site-header" style={{ viewTransitionName: "persistent-nav" }}>
      <div className="app-site-header-inner">
        <div className="app-site-header-top">
          <Link
            href="/"
            className="app-site-brand"
            aria-label="Asesmen Pendis Kutai Barat"
            onClick={closeMenu}
          >
            <Image
              src="/madani_logo.png"
              alt="MADANI"
              width={6250}
              height={6250}
              priority
              className="app-site-brand-logo"
            />
            {/*<span className="app-site-brand-title">Asesmen Pendis Kutai Barat</span>*/}
          </Link>

          <button
            type="button"
            className="app-site-menu-button"
            aria-expanded={isOpen}
            aria-controls="global-nav-menu"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setIsOpen((current) => !current)}
          >
            <span className={`app-site-menu-bar ${isOpen ? "app-site-menu-bar-open-top" : ""}`} />
            <span className={`app-site-menu-bar ${isOpen ? "app-site-menu-bar-open-middle" : ""}`} />
            <span className={`app-site-menu-bar ${isOpen ? "app-site-menu-bar-open-bottom" : ""}`} />
          </button>
        </div>

        <nav
          id="global-nav-menu"
          className={`app-site-nav ${isOpen ? "app-site-nav-open" : ""}`}
          aria-label="Navigasi utama"
        >
          {navItems.map((item) => {
            const isActive = isNavActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`app-site-nav-link ${isActive ? "app-site-nav-link-active" : ""}`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="flex flex-col gap-3 md:ml-auto md:flex-row md:items-center md:justify-end">
            <Link
              href={isAdminOrGuruLoggedIn ? "/admin/dashboard" : "/admin/login"}
              className="app-button-primary min-w-[120px] justify-center"
              onClick={closeMenu}
            >
              {isAdminOrGuruLoggedIn ? "Dashboard" : "Login"}
            </Link>
            {isAdminOrGuruLoggedIn && activeUserEmail ? (
              <AdminProfileMenu email={activeUserEmail} />
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}
