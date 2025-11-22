"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Star } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { TagSelector } from "@/components/tags/TagSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
}

interface PromptEditorProps {
  initialPrompt?: Prompt | null;
  onCancel?: () => void;
}

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "debugging", label: "Debugging" },
  { value: "refactoring", label: "Refactoring" },
  { value: "learning", label: "Learning" },
  { value: "documentation", label: "Documentación" },
];

export function PromptEditor({ initialPrompt = null, onCancel }: PromptEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialPrompt?.content || "");
  const [title, setTitle] = useState(initialPrompt?.title || "");
  const [category, setCategory] = useState(initialPrompt?.category || "general");
  const [isFavorite, setIsFavorite] = useState(initialPrompt?.isFavorite || false);
  const [saving, setSaving] = useState(false);
  const [prompt, setPrompt] = useState<Prompt | null>(initialPrompt);
  const [tags, setTags] = useState<Tag[]>(initialPrompt?.tags || []);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTags = async (promptId: string) => {
    try {
      const res = await fetch(`/api/notes/Prompt/${promptId}/tags`);
      if (res.ok) {
        const fetchedTags = await res.json();
        setTags(fetchedTags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    if (initialPrompt) {
      setContent(initialPrompt.content || "");
      setTitle(initialPrompt.title || "");
      setCategory(initialPrompt.category || "general");
      setIsFavorite(initialPrompt.isFavorite || false);
      setPrompt(initialPrompt);
      setTags(initialPrompt.tags || []);
    }
  }, [initialPrompt?.id]);

  useEffect(() => {
    if (prompt?.id && !initialPrompt?.tags) {
      fetchTags(prompt.id);
    }
  }, [prompt?.id, initialPrompt?.tags]);

  const handleSave = useCallback(async (showSaving = true) => {
    if (showSaving) setSaving(true);
    try {
      if (prompt) {
        // Update existing prompt
        const res = await fetch(`/api/prompts/${prompt.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, title, category, isFavorite }),
        });

        if (res.ok) {
          const updated = await res.json();
          setPrompt(updated);
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error("Error updating prompt:", errorData);
          if (showSaving) {
            alert(`Error al actualizar prompt: ${errorData.error || "Error desconocido"}`);
          }
        }
      } else {
        // Create new prompt
        const res = await fetch("/api/prompts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, title, category, isFavorite }),
        });

        if (res.ok) {
          const created = await res.json();
          setPrompt(created);
          router.push(`/prompts/${created.id}`);
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error("Error creating prompt:", errorData);
          if (showSaving) {
            alert(`Error al crear prompt: ${errorData.error || "Error desconocido"}`);
          }
        }
      }
    } catch (error) {
      console.error("Error saving prompt:", error);
      if (showSaving) {
        alert(`Error al guardar: ${error instanceof Error ? error.message : "Error desconocido"}`);
      }
    } finally {
      if (showSaving) setSaving(false);
    }
  }, [content, title, category, isFavorite, prompt, router]);

  useEffect(() => {
    if (!title.trim()) return;
    if (prompt) return; // Si ya existe el prompt, solo actualizar

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave(false);
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [content, title, category, isFavorite, handleSave, prompt]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onCancel ? (
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            <Link href="/prompts">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {prompt ? "Editar Prompt" : "Nuevo Prompt"}
            </h1>
          </div>
        </div>
        <Button
          onClick={async () => {
            if (autoSaveTimeoutRef.current) {
              clearTimeout(autoSaveTimeoutRef.current);
              autoSaveTimeoutRef.current = null;
            }
            await handleSave(true);
          }}
          disabled={saving || !title.trim()}
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Guardando..." : prompt ? "Guardar" : "Crear"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Título</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="title">Título del prompt *</Label>
              <Input
                id="title"
                placeholder="Ej: Refactorizar función..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categoría y Favorito</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant={isFavorite ? "default" : "outline"}
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-full"
            >
              <Star className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Favorito" : "Marcar como favorito"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {prompt?.id ? (
            <TagSelector
              selectedTags={tags}
              onTagsChange={setTags}
              noteType="Prompt"
              noteId={prompt.id}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Guarda el prompt primero para agregar tags
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
            placeholder="Escribe el prompt aquí..."
          />
        </CardContent>
      </Card>
    </div>
  );
}

