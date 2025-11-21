"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2, Star, Copy } from "lucide-react";
import Link from "next/link";
import { TagSelector } from "@/components/tags/TagSelector";
import { cn } from "@/lib/utils";

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
  tags?: Array<{ tag: Tag }>;
}

interface PromptViewProps {
  prompt: Prompt;
}

const categoryColors: Record<string, string> = {
  general: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  debugging: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  refactoring: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  learning: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  documentation: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  testing: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

const categoryLabels: Record<string, string> = {
  general: "General",
  debugging: "Debugging",
  refactoring: "Refactoring",
  learning: "Learning",
  documentation: "Documentation",
  testing: "Testing",
};

export function PromptView({ prompt: initialPrompt }: PromptViewProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState(initialPrompt);
  const [tags, setTags] = useState<Tag[]>(
    initialPrompt.tags?.map((t) => t.tag) || []
  );

  useEffect(() => {
    if (prompt.id) {
      fetchTags();
    }
  }, [prompt.id]);

  const fetchTags = async () => {
    try {
      const res = await fetch(`/api/notes/Prompt/${prompt.id}/tags`);
      if (res.ok) {
        const fetchedTags = await res.json();
        setTags(fetchedTags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const res = await fetch(`/api/prompts/${prompt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !prompt.isFavorite }),
      });

      if (res.ok) {
        const updated = await res.json();
        setPrompt(updated);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      // You could add a toast notification here
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este prompt?")) {
      return;
    }

    try {
      const res = await fetch(`/api/prompts/${prompt.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/prompts");
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
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
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{prompt.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
            >
              <Star
                className={cn(
                  "h-5 w-5",
                  prompt.isFavorite && "fill-yellow-500 text-yellow-500"
                )}
              />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-block text-sm px-3 py-1 rounded-full font-medium",
            categoryColors[prompt.category] || categoryColors.general
          )}
        >
          {categoryLabels[prompt.category] || prompt.category}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <TagSelector
            selectedTags={tags}
            onTagsChange={setTags}
            noteType="Prompt"
            noteId={prompt.id}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contenido</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md overflow-x-auto">
            {prompt.content}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

