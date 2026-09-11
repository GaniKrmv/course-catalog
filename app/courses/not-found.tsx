import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Course not found</h1>
      <p className="text-gray-600 mb-5">
        That course doesn't exist in the catalog.
      </p>
      <Link
        href="/courses"
        className="text-blue-600 hover:underline"
      >
        ← Back to courses
      </Link>
    </div>
  );
}
