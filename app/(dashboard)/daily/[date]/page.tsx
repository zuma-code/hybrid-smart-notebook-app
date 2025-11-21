import { DailyNoteEditor } from "@/components/daily/DailyNoteEditor";
import { notFound } from "next/navigation";

async function getDailyNote(date: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/daily/${date}`, {
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
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound();
  }

  const note = await getDailyNote(date);

  return <DailyNoteEditor date={date} initialNote={note} />;
}

