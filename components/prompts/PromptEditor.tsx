"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { TagSelector } from "@/components/tags/TagSelector";

interface Tag {
  id: string;
  name: string;
  color: string;
}

const categories = [
  { value: "general", label: "General" },
  { value: "debugging", label: "Debugging" },
  { value: "refactoring", label: "Refactoring" },
  { value: "learning", label: "Learning" },
  { value: "documentation", label: "Documentation" },
  { value: "testing", label: "Testing" },
];

export function PromptEditor() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [isFavorite, setIsFavorite] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptId, setPromptId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("El título y contenido son requeridos");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category,
          isFavorite,
        }),
      });

      if (res.ok) {
        const prompt = await res.json();
        setPromptId(prompt.id);
        router.push(`/prompts/${prompt.id}`);
      } else {
        const data = await res.json();
        setError(data.error || "Error al crear el prompt");
      }
    } catch (error) {
      console.error("Error creating prompt:", error);
      setError("Error al crear el prompt");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/prompts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nuevo Prompt</h1>
            <p className="text-sm text-muted-foreground">
              Guarda un prompt de Cursor o chat
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving || !title.trim() || !content.trim()}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Guardando..." : "Guardar Prompt"}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Título</CardTitle>
            <CardDescription>
              Un título descriptivo para este prompt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Ej: Refactorizar función con TypeScript"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              className="text-lg"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categoría</CardTitle>
            <CardDescription>
              Clasifica este prompt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="favorite"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="favorite" className="cursor-pointer">
                Marcar como favorito
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {promptId && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <TagSelector
              selectedTags={tags}
              onTagsChange={setTags}
              noteType="Prompt"
              noteId={promptId}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contenido del Prompt</CardTitle>
          <CardDescription>
            Pega aquí el prompt completo de Cursor o chat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError(null);
            }}
            placeholder="Pega aquí tu prompt..."
            className="w-full min-h-[300px] p-3 border rounded-md font-mono text-sm resize-y"
          />
        </CardContent>
      </Card>
    </div>
  );
}

