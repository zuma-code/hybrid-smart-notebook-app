"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { ConceptCard } from "./ConceptCard";
import { Input } from "@/components/ui/input";

interface Concept {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function ConceptList() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchConcepts();
  }, [search]);

  const fetchConcepts = async () => {
    try {
      const url = search
        ? `/api/concepts?search=${encodeURIComponent(search)}`
        : "/api/concepts";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setConcepts(data);
      }
    } catch (error) {
      console.error("Error fetching concepts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Conceptos</h1>
        </div>
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Conceptos</h1>
        <Link href="/concepts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Concepto
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Búsqueda</CardTitle>
          <CardDescription>Busca conceptos por título o contenido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar conceptos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {concepts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {search
                ? "No se encontraron conceptos con ese término de búsqueda"
                : "Aún no has creado ningún concepto. ¡Crea tu primer concepto!"}
            </p>
            {!search && (
              <Link href="/concepts/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primer Concepto
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {concepts.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      )}
    </div>
  );
}





