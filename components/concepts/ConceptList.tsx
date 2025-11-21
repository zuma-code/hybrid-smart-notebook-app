"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { ConceptCard } from "./ConceptCard";

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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchConcepts();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchConcepts(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchConcepts = async (search?: string) => {
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
    return <div className="text-muted-foreground">Cargando conceptos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar conceptos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Link href="/concepts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Concepto
          </Button>
        </Link>
      </div>

      {concepts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No hay conceptos aún</CardTitle>
            <CardDescription>
              Comienza creando tu primer concepto de programación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/concepts/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Crear Concepto
              </Button>
            </Link>
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

