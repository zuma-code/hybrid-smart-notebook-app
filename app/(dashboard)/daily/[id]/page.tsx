import { DailyNoteEditor } from "@/components/daily/DailyNoteEditor";
import { notFound } from "next/navigation";

async function getDailyNote(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/daily/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching daily note:", error);
    return null;
  }
}

export default async function DailyNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const note = await getDailyNote(id);

  if (!note) {
    notFound();
  }

  return <DailyNoteEditor initialNote={note} />;
}

