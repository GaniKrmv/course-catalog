import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Course Catalog",
  description: "Advanced Web Technologies — course catalog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex gap-6">
          <Link href="/" className="font-medium hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/courses" className="font-medium hover:text-blue-600 transition-colors">
            Courses
          </Link>
          <Link href="/about" className="font-medium hover:text-blue-600 transition-colors">
            About
          </Link>
        </nav>
        <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
