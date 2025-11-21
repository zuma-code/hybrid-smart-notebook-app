"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

export function ConceptEditor() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("El título es requerido");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/concepts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content }),
      });

      if (res.ok) {
        const concept = await res.json();
        router.push(`/concepts/${concept.slug}`);
      } else {
        const data = await res.json();
        setError(data.error || "Error al crear el concepto");
      }
    } catch (error) {
      console.error("Error creating concept:", error);
      setError("Error al crear el concepto");
    } finally {
      setSaving(false);
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Nuevo Concepto
            </h1>
            <p className="text-sm text-muted-foreground">
              Crea un nuevo concepto de programación
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving || !title.trim()}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Guardando..." : "Guardar Concepto"}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Título</CardTitle>
          <CardDescription>
            El título se convertirá automáticamente en un slug único
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Ej: React Hooks, TypeScript Generics, etc."
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
          <CardTitle>Contenido</CardTitle>
          <CardDescription>
            Escribe sobre este concepto, incluye ejemplos de código, explicaciones, etc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Escribe sobre este concepto de programación..."
          />
        </CardContent>
      </Card>
    </div>
  );
}

