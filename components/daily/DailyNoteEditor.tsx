"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { formatDate, getTodayDateString } from "@/lib/utils";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

interface DailyNote {
  id: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface DailyNoteEditorProps {
  date: string;
  initialNote: DailyNote | null;
}

export function DailyNoteEditor({ date, initialNote }: DailyNoteEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialNote?.content || "");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<DailyNote | null>(initialNote);

  useEffect(() => {
    if (!note) {
      // Auto-create note if it doesn't exist
      createNote();
    }
  }, []);

  const createNote = async () => {
    try {
      const res = await fetch("/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, content: "" }),
      });

      if (res.ok) {
        const newNote = await res.json();
        setNote(newNote);
      }
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleSave = async () => {
    if (!note) return;

    setSaving(true);
    try {
      // Save the note content
      const res = await fetch(`/api/daily/${date}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const updated = await res.json();
        setNote(updated);

        // Update bidirectional links
        await fetch("/api/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromNoteType: "DailyNote",
            fromNoteId: updated.id,
            content,
          }),
        });
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setSaving(false);
    }
  };

  const getPreviousDate = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  const getNextDate = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const today = getTodayDateString();
  const isToday = date === today;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/daily">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {formatDate(date)}
            </h1>
            {isToday && (
              <p className="text-sm text-muted-foreground">Hoy</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/daily/${getPreviousDate()}`}>
            <Button variant="outline" size="sm">
              Anterior
            </Button>
          </Link>
          <Link href={`/daily/${getNextDate()}`}>
            <Button variant="outline" size="sm">
              Siguiente
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contenido</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Escribe tus pensamientos, ideas y aprendizajes del día..."
          />
        </CardContent>
      </Card>
    </div>
  );
}

