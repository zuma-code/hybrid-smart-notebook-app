"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
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

interface Concept {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
}

interface ConceptEditorProps {
  initialConcept?: Concept | null;
  onCancel?: () => void;
}

export function ConceptEditor({ initialConcept = null, onCancel }: ConceptEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialConcept?.content || "");
  const [title, setTitle] = useState(initialConcept?.title || "");
  const [saving, setSaving] = useState(false);
  const [concept, setConcept] = useState<Concept | null>(initialConcept);
  const [tags, setTags] = useState<Tag[]>(initialConcept?.tags || []);

  const fetchTags = async (conceptId: string) => {
    try {
      const res = await fetch(`/api/notes/Concept/${conceptId}/tags`);
      if (res.ok) {
        const fetchedTags = await res.json();
        setTags(fetchedTags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    if (initialConcept) {
      setContent(initialConcept.content || "");
      setTitle(initialConcept.title || "");
      setConcept(initialConcept);
      setTags(initialConcept.tags || []);
    }
  }, [initialConcept?.id]);

  // Cargar tags si el concepto tiene ID pero no vienen en initialConcept
  useEffect(() => {
    if (concept?.id && !initialConcept?.tags) {
      fetchTags(concept.id);
    }
  }, [concept?.id, initialConcept?.tags]);

  const handleSave = useCallback(async (showSaving = true) => {
    if (showSaving) setSaving(true);
    try {
      if (concept) {
        // Update existing concept
        const res = await fetch(`/api/concepts/${concept.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, title }),
        });

        if (res.ok) {
          const updated = await res.json();
          setConcept(updated);
          
          // Sync wiki-links
          try {
            await fetch(`/api/notes/Concept/${concept.id}/links`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ content }),
            });
          } catch (error) {
            console.error("Error syncing wiki-links:", error);
          }
        }
      } else {
        // Create new concept
        const res = await fetch("/api/concepts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, title }),
        });

        if (res.ok) {
          const created = await res.json();
          setConcept(created);
          router.push(`/concepts/${created.slug}`);
        }
      }
    } catch (error) {
      console.error("Error saving concept:", error);
    } finally {
      if (showSaving) setSaving(false);
    }
  }, [content, title, concept, router]);

  useEffect(() => {
    if (!title.trim()) return;

    const timeoutId = setTimeout(() => {
      handleSave(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [content, title, handleSave]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onCancel ? (
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            <Link href="/concepts">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {concept ? "Editar Concepto" : "Nuevo Concepto"}
            </h1>
          </div>
        </div>
        <Button onClick={() => handleSave()} disabled={saving || !title.trim()}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Guardando..." : concept ? "Guardar" : "Crear"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Título</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="title">Título del concepto *</Label>
            <Input
              id="title"
              placeholder="Ej: React Hooks, TypeScript Generics..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {concept && (
              <p className="text-xs text-muted-foreground">
                Slug: {concept.slug}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {concept?.id ? (
            <TagSelector
              selectedTags={tags}
              onTagsChange={setTags}
              noteType="Concept"
              noteId={concept.id}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Guarda el concepto primero para agregar tags
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
            placeholder="Explica el concepto, incluye ejemplos de código, casos de uso..."
          />
        </CardContent>
      </Card>
    </div>
  );
}

