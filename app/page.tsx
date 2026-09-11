import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Advanced Web Technologies — Course Catalog</h1>
      <p className="text-gray-600 mb-6">
        Browse all courses for the semester and track what interests you.
      </p>
      <Link
        href="/courses"
        className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        View Courses
      </Link>
    </div>
  );
}
