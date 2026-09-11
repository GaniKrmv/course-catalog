import Link from "next/link";

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  credits: number;
  likes: number;
};

export default function CourseCard({
  id,
  title,
  description,
  credits,
  likes,
}: CourseCardProps) {
  return (
    <Link
      href={`/courses/${id}`}
      className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
    >
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{credits} credits</span>
        <span>❤ {likes}</span>
      </div>
    </Link>
  );
}
