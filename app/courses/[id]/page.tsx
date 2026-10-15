import { notFound } from "next/navigation";
import { getCourse } from "@/lib/courses";
import LikeButton from "@/components/LikeButton";
import { EnrollForm } from "@/components/EnrollForm";

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
      <LikeButton courseId={course.id} initialLikes={course.likes} />
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Enroll in this course</h2>
        <EnrollForm courseId={course.id} />
      </section>
    </div>
  );
}
