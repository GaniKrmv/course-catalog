"use client";

import { useState } from "react";
import type { Course } from "@/lib/courses";

const API = process.env.NEXT_PUBLIC_API_URL;

type LikeButtonProps = { courseId: string; initialLikes: number };

export default function LikeButton({ courseId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (pending) return;
    setPending(true);
    setFailed(false);
    try {
      if (!API) throw new Error("NEXT_PUBLIC_API_URL is not set");
      const res = await fetch(`${API}/courses/${encodeURIComponent(courseId)}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const course: Course = await res.json();
      setLikes(course.likes);
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={pending} aria-busy={pending}
        className="inline-flex items-center gap-2 rounded border border-red-200 bg-red-50 px-4 py-2 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50">
        ❤ {likes}
      </button>
      {failed && <p role="alert" className="mt-2 text-red-600">Failed to like the course</p>}
    </div>
  );
}
