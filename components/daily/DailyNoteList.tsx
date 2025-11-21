"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { formatDate, getTodayDateString } from "@/lib/utils";
import { QuickCapture } from "./QuickCapture";

interface DailyNote {
  id: string;
  date: string;
  title?: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function DailyNoteList() {
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/daily");
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Cargando notas...</div>;
  }

  // Group notes by date
  const notesByDate = notes.reduce((acc, note) => {
    if (!acc[note.date]) {
      acc[note.date] = [];
    }
    acc[note.date].push(note);
    return acc;
  }, {} as Record<string, DailyNote[]>);

  const sortedDates = Object.keys(notesByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tus Notas Diarias</h2>
        <QuickCapture
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Nota
            </Button>
          }
          onNoteCreated={fetchNotes}
        />
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No hay notas aún</CardTitle>
            <CardDescription>
              Comienza creando tu primera nota diaria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuickCapture
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primera Nota
                </Button>
              }
              onNoteCreated={fetchNotes}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const dateNotes = notesByDate[date];
            const isToday = date === getTodayDateString();
            
            return (
              <div key={date} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">
                    {formatDate(date)}
                    {isToday && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        • Hoy
                      </span>
                    )}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    ({dateNotes.length} {dateNotes.length === 1 ? "nota" : "notas"})
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {dateNotes.map((note) => (
                    <Link key={note.id} href={`/daily/${note.id}`}>
                      <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {note.title || "Sin título"}
                          </CardTitle>
                          <CardDescription>
                            {note.content
                              ? `${note.content.substring(0, 100)}${note.content.length > 100 ? "..." : ""}`
                              : "Nota vacía"}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
