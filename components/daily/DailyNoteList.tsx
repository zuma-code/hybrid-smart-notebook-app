"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { formatDate, getTodayDateString } from "@/lib/utils";

interface DailyNote {
  id: string;
  date: string;
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

  const today = getTodayDateString();

  if (loading) {
    return <div className="text-muted-foreground">Cargando notas...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tus Notas Diarias</h2>
        <Link href={`/daily/${today}`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Nota de Hoy
          </Button>
        </Link>
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
            <Link href={`/daily/${today}`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Crear Nota de Hoy
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Link key={note.id} href={`/daily/${note.date}`}>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-lg">
                      {formatDate(note.date)}
                    </CardTitle>
                  </div>
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
      )}
    </div>
  );
}

