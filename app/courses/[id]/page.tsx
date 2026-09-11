import { notFound } from "next/navigation";
import { getCourse, getCourses } from "@/lib/courses";
import LikeButton from "@/components/LikeButton";

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((course) => ({ id: course.id }));
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <p className="text-sm text-gray-500 mb-6">
        {course.credits} credits &nbsp;·&nbsp;{" "}
        {course.isElective ? "Elective" : "Required"}
      </p>
      <LikeButton initialLikes={course.likes} />
    </div>
  );
}
