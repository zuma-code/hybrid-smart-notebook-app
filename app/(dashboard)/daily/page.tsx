import { DailyNoteList } from "@/components/daily/DailyNoteList";

export default function DailyNotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daily Notes</h1>
        <p className="text-muted-foreground">
          Tu cuaderno diario de aprendizaje
        </p>
      </div>
      <DailyNoteList />
    </div>
  );
}

