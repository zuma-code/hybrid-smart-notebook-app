"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { formatDate, getTodayDateString } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { TagSelector } from "@/components/tags/TagSelector";
import { extractWikiLinks } from "@/lib/wiki-links";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface DailyNote {
  id: string;
  date: string;
  title?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
}

interface DailyNoteEditorProps {
  initialNote: DailyNote | null;
}

export function DailyNoteEditor({ initialNote }: DailyNoteEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialNote?.content || "");
  const [title, setTitle] = useState(initialNote?.title || "");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<DailyNote | null>(initialNote);
  const [tags, setTags] = useState<Tag[]>(initialNote?.tags || []);

  const fetchTags = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes/DailyNote/${noteId}/tags`);
      if (res.ok) {
        const fetchedTags = await res.json();
        setTags(fetchedTags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    setContent(initialNote?.content || "");
    setTitle(initialNote?.title || "");
    setNote(initialNote);
    setTags(initialNote?.tags || []);
  }, [initialNote?.id]);

  // Cargar tags si la nota tiene ID pero no vienen en initialNote
  useEffect(() => {
    if (note?.id && !initialNote?.tags) {
      fetchTags(note.id);
    }
  }, [note?.id, initialNote?.tags]);

  const handleSave = useCallback(async (showSaving = true) => {
    if (!note) return;

    if (showSaving) setSaving(true);
    try {
      const res = await fetch(`/api/daily/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, title }),
      });

      if (res.ok) {
        const updated = await res.json();
        setNote(updated);
        
        // Sync wiki-links
        try {
          await fetch(`/api/notes/DailyNote/${note.id}/links`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
          });
        } catch (error) {
          console.error("Error syncing wiki-links:", error);
        }
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      if (showSaving) setSaving(false);
    }
  }, [content, title, note]);

  useEffect(() => {
    if (!note || (!content && !title)) return;

    const timeoutId = setTimeout(() => {
      handleSave(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [content, title, note, handleSave]);

  const today = getTodayDateString();
  const isToday = note?.date === today;

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
              {note?.date ? formatDate(note.date) : "Cargando..."}
            </h1>
            {isToday && (
              <p className="text-sm text-muted-foreground">Hoy</p>
            )}
          </div>
        </div>
        <Button onClick={() => handleSave()} disabled={saving || !note}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Guardando..." : note ? "Guardar" : "Creando..."}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Título</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Título de la nota (opcional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!note}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {note?.id ? (
            <TagSelector
              selectedTags={tags}
              onTagsChange={setTags}
              noteType="DailyNote"
              noteId={note.id}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Guarda la nota primero para agregar tags
            </p>
          )}
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
            disabled={!note}
          />
        </CardContent>
      </Card>
    </div>
  );
}

