import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <Link href={`/courses/${id}`} className="block">
      <Card className="hover:shadow-md hover:border-blue-300 transition-all duration-200 h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{credits} credits</span>
            <Button variant="outline" size="sm">
              ❤ {likes}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
