"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function IconBowl({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 11c0 4.5 3.6 8 8 8s8-3.5 8-8" />
      <path d="M4 11h16" />
    </svg>
  );
}

function IconShop({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 9h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9Z" />
      <path d="M3 9 5 4h14l2 5" />
      <path d="M10 14h4" />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx={12} cy={8} r={3.5} />
      <path d="M6 20v-1a6 6 0 0 1 12 0v1" />
    </svg>
  );
}

const items = [
  { href: "/recipe", label: "ごはん", Icon: IconBowl, match: (p: string) => p === "/recipe" || p.startsWith("/recipe/") },
  { href: "/foodshop", label: "お店", Icon: IconShop, match: (p: string) => p.startsWith("/foodshop") },
  { href: "/login", label: "ログイン", Icon: IconUser, match: (p: string) => p.startsWith("/login") },
] as const;

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer
      className={[
        "z-50 border-zinc-200/90 bg-white/85 backdrop-blur-xl",
        "dark:border-zinc-800 dark:bg-zinc-950/90",
        "md:border-t md:py-3",
        "fixed inset-x-0 bottom-0 md:static md:backdrop-blur-none",
        "pb-[env(safe-area-inset-bottom)]",
        "shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.08)] md:shadow-none",
      ].join(" ")}
    >
      <nav
        className="mx-auto max-w-lg px-2 md:max-w-none md:px-4"
        aria-label="メインナビゲーション"
      >
        <ul className="flex h-14 items-stretch justify-around gap-1 md:h-auto md:justify-center md:gap-8">
          {items.map(({ href, label, Icon, match }) => {
            const active = match(pathname);
            return (
              <li key={href} className="flex min-w-0 flex-1 md:flex-none">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex min-h-[3rem] flex-1 touch-manipulation flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[11px] font-semibold tracking-tight transition-colors md:min-h-0 md:flex-row md:gap-2 md:rounded-lg md:px-3 md:py-2 md:text-sm",
                    "outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950",
                    active
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-zinc-500 hover:text-zinc-800 active:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-8 w-14 items-center justify-center rounded-full transition-colors md:h-9 md:w-9 md:rounded-lg",
                      active
                        ? "bg-orange-500/15 text-orange-600 dark:bg-orange-400/15 dark:text-orange-400"
                        : "bg-transparent",
                    ].join(" ")}
                  >
                    <Icon className="shrink-0" />
                  </span>
                  <span className="leading-none">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
