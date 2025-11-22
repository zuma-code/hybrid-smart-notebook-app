"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { TagBadge } from "@/components/tags/TagBadge";
import { ConceptEditor } from "./ConceptEditor";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Backlink {
  id: string;
  fromNoteType: string;
  fromNoteId: string;
  linkType: string;
}

interface Concept {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
  backlinks?: Backlink[];
}

interface ConceptViewProps {
  slug: string;
}

export function ConceptView({ slug }: ConceptViewProps) {
  const router = useRouter();
  const [concept, setConcept] = useState<Concept | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchConcept();
  }, [slug]);

  const fetchConcept = async () => {
    try {
      const res = await fetch(`/api/concepts/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setConcept(data);
      } else if (res.status === 404) {
        router.push("/concepts");
      }
    } catch (error) {
      console.error("Error fetching concept:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!concept || !confirm("¿Estás seguro de que quieres eliminar este concepto?")) {
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

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Cargando concepto...</p>
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Concepto no encontrado</p>
        <Link href="/concepts">
          <Button>Volver a Conceptos</Button>
        </Link>
      </div>
    );
  }

  if (editing) {
    return (
      <ConceptEditor
        initialConcept={concept}
        onCancel={() => {
          setEditing(false);
          fetchConcept(); // Refresh to get latest data
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/concepts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{concept.title}</h1>
            <p className="text-sm text-muted-foreground">
              Creado el {new Date(concept.createdAt).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
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

      {concept.tags && concept.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {concept.tags.map((tag) => (
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
              content={concept.content}
              onChange={() => {}}
              disabled={true}
            />
          </div>
        </CardContent>
      </Card>

      {concept.backlinks && concept.backlinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Enlaces relacionados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {concept.backlinks.length} nota(s) hacen referencia a este concepto
            </p>
            {/* TODO: Implementar lista de backlinks con navegación */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

