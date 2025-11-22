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
  title?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface GroupedNotes {
  [date: string]: DailyNote[];
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

  const today = getTodayDateString();

  const groupedNotes: GroupedNotes = notes.reduce((acc, note) => {
    (acc[note.date] = acc[note.date] || []).push(note);
    return acc;
  }, {} as GroupedNotes);

  const sortedDates = Object.keys(groupedNotes).sort((a, b) => b.localeCompare(a));

  if (loading) {
    return <div className="text-muted-foreground">Cargando notas...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tus Notas Diarias</h2>
        <div className="flex gap-2">
          <Link href={`/daily/${today}`}>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Nota de Hoy
            </Button>
          </Link>
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
                  Crear Nota de Hoy
                </Button>
              }
              defaultDate={today}
              onNoteCreated={fetchNotes}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                {formatDate(date)} ({groupedNotes[date].length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedNotes[date].map((note) => (
                  <Link key={note.id} href={`/daily/${note.id}`}>
                    <Card className="hover:bg-accent transition-colors cursor-pointer">
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
          ))}
        </div>
      )}
    </div>
  );
}

