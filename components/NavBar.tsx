"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/filter", label: "Filter" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-2 flex gap-2">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "px-3 py-2 rounded text-sm font-medium transition-colors hover:bg-slate-100 hover:text-blue-600",
            pathname === href && "bg-slate-100 text-blue-600"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
