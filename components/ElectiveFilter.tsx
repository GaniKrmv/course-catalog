"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import type { Course } from "@/lib/courses";

const API = process.env.NEXT_PUBLIC_API_URL;

async function fetcher(url: string): Promise<Course[]> {
  if (!API) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function ElectiveFilter() {
  const [onlyElective, setOnlyElective] = useState(false);
  const query = onlyElective ? "?is_elective=true" : "";
  const { data, error, isLoading } = useSWR(`${API}/courses${query}`, fetcher);

  return (
    <div>
      <label className="mb-4 flex items-center gap-2">
        <input type="checkbox" checked={onlyElective}
          onChange={(e) => setOnlyElective(e.target.checked)} />
        Electives only
      </label>
      {error && <p role="alert">Failed to load courses</p>}
      {isLoading && <p role="status">Loading…</p>}
      {data && !error && (
        <ul className="list-disc space-y-2 pl-6">
          {data.map((course) => (
            <li key={course.id}>
              <Link href={`/courses/${course.id}`} className="text-blue-600 hover:underline">
                {course.title}
              </Link>
              {` — ${course.credits} cr.`}{course.isElective && " · elective"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
