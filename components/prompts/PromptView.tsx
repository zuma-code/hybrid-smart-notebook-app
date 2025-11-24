"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2, Star, Copy } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { TagBadge } from "@/components/tags/TagBadge";
import { Badge } from "@/components/ui/badge";
import { PromptEditor } from "./PromptEditor";

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

interface PromptViewProps {
  id: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  debugging: "Debugging",
  refactoring: "Refactoring",
  learning: "Learning",
  documentation: "Documentación",
};

const CATEGORY_COLORS: Record<string, string> = {
  general: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  debugging: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  refactoring: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  learning: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  documentation: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export function PromptView({ id }: PromptViewProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchPrompt();
  }, [id]);

  const fetchPrompt = async () => {
    try {
      const res = await fetch(`/api/prompts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPrompt(data);
      } else if (res.status === 404) {
        router.push("/prompts");
      }
    } catch (error) {
      console.error("Error fetching prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!prompt || !confirm("¿Estás seguro de que quieres eliminar este prompt?")) {
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

  const handleCopy = async () => {
    if (!prompt) return;
    
    try {
      // Copy content as plain text (remove HTML tags)
      const plainText = prompt.content.replace(/<[^>]*>/g, "");
      await navigator.clipboard.writeText(plainText);
      // TODO: Show toast notification
    } catch (error) {
      console.error("Error copying prompt:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Cargando prompt...</p>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Prompt no encontrado</p>
        <Link href="/prompts">
          <Button>Volver a Prompts</Button>
        </Link>
      </div>
    );
  }

  if (editing) {
    return (
      <PromptEditor
        initialPrompt={prompt}
        onCancel={() => {
          setEditing(false);
          fetchPrompt();
        }}
      />
    );
  }

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
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{prompt.title}</h1>
              {prompt.isFavorite && (
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="secondary"
                className={CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS.general}
              >
                {CATEGORY_LABELS[prompt.category] || prompt.category}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Creado el {new Date(prompt.createdAt).toLocaleDateString("es-ES")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCopy} variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Copiar
          </Button>
          <Button onClick={() => setEditing(true)} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      {prompt.tags && prompt.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contenido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <RichTextEditor
              content={prompt.content}
              onChange={() => {}}
              disabled={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}





