"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { formatDate, getTodayDateString } from "@/lib/utils";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { TagSelector } from "@/components/tags/TagSelector";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface DailyNote {
  id: string;
  date: string;
  title?: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: Array<{ tag: Tag }>;
}

interface DailyNoteEditorProps {
  noteId?: string;
  initialNote: DailyNote | null;
}

export function DailyNoteEditor({ noteId, initialNote }: DailyNoteEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialNote?.content || "");
  const [title, setTitle] = useState(initialNote?.title || "");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<DailyNote | null>(initialNote);
  const [tags, setTags] = useState<Tag[]>(
    initialNote?.tags?.map((t) => t.tag) || []
  );

  const fetchTags = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/notes/DailyNote/${id}/tags`);
      if (res.ok) {
        const fetchedTags = await res.json();
        setTags(fetchedTags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }, []);

  // Reset state when noteId or initialNote changes
  useEffect(() => {
    if (initialNote) {
      setContent(initialNote.content || "");
      setTitle(initialNote.title || "");
      setNote(initialNote);
      setTags(initialNote.tags?.map((t) => t.tag) || []);
    }
  }, [noteId, initialNote?.id]);

  // Fetch tags when note is available
  useEffect(() => {
    if (note?.id && !initialNote?.tags) {
      fetchTags(note.id);
    }
  }, [note?.id, initialNote?.tags, fetchTags]);

  const handleSave = async (showSaving = true) => {
    if (!note?.id) return;

    if (showSaving) setSaving(true);
    try {
      // Save the note content and title
      const res = await fetch(`/api/daily/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || null, content }),
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
      if (showSaving) setSaving(false);
    }
  };

  // Auto-save after 2 seconds of no typing
  useEffect(() => {
    if (!note?.id || !content) return;

    const timeoutId = setTimeout(() => {
      handleSave(false); // Auto-save without showing saving state
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [content, title, note?.id]);

  if (!note) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando nota...</p>
      </div>
    );
  }

  const today = getTodayDateString();
  const isToday = note.date === today;

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
              {title || formatDate(note.date)}
            </h1>
            <p className="text-sm text-muted-foreground">
              {formatDate(note.date)} {isToday && "• Hoy"}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Título (Opcional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Reunión de equipo, Ideas de proyecto..."
            onBlur={() => handleSave(false)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <TagSelector
            selectedTags={tags}
            onTagsChange={setTags}
            noteType="DailyNote"
            noteId={note.id}
          />
        </CardContent>
      </Card>

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
