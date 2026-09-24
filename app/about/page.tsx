export default function AboutPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">About This Catalog</h1>
      <p className="text-gray-700 mb-3">
        This course catalog is the semester project for the Advanced Web Technologies course.
        It was built with Next.js 16, TypeScript, and Tailwind CSS.
      </p>
      <p className="text-gray-700">
        Each week we extend it with new features — API integrations, authentication,
        and database persistence — following the topics covered in lectures.
      </p>
    </div>
  );
}
