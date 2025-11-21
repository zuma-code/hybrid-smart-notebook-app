"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

interface Concept {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  backlinks?: Array<{
    id: string;
    fromNoteType: string;
    fromNoteId: string;
    linkType: string;
  }>;
}

interface ConceptViewProps {
  concept: Concept;
}

export function ConceptView({ concept: initialConcept }: ConceptViewProps) {
  const router = useRouter();
  const [concept, setConcept] = useState(initialConcept);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(concept.title);
  const [content, setContent] = useState(concept.content);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/concepts/${concept.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        const updated = await res.json();
        setConcept(updated);
        setIsEditing(false);
        if (updated.slug !== concept.slug) {
          router.push(`/concepts/${updated.slug}`);
        }
      }
    } catch (error) {
      console.error("Error saving concept:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este concepto?")) {
      return;
    }

    try {
      const res = await fetch(`/api/concepts/${concept.slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/concepts");
      }
    } catch (error) {
      console.error("Error deleting concept:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/concepts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold tracking-tight bg-transparent border-b-2 border-primary focus:outline-none"
            />
          ) : (
            <h1 className="text-3xl font-bold tracking-tight">{concept.title}</h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contenido</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Escribe sobre este concepto..."
            />
          ) : (
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content || "<p>Sin contenido</p>" }}
            />
          )}
        </CardContent>
      </Card>

      {concept.backlinks && concept.backlinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Enlaces desde otras notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {concept.backlinks.length} nota(s) referencian este concepto
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

