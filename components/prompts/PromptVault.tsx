"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Star, StarOff } from "lucide-react";
import Link from "next/link";
import { PromptCard } from "./PromptCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  { value: "all", label: "Todas las categorías" },
  { value: "general", label: "General" },
  { value: "debugging", label: "Debugging" },
  { value: "refactoring", label: "Refactoring" },
  { value: "learning", label: "Learning" },
  { value: "documentation", label: "Documentación" },
];

export function PromptVault() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    fetchPrompts();
  }, [search, category, showFavoritesOnly]);

  const fetchPrompts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category !== "all") params.append("category", category);
      if (showFavoritesOnly) params.append("favorite", "true");

      const url = `/api/prompts${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPrompts(data);
      }
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Prompt Vault</h1>
        </div>
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Prompt Vault</h1>
        <Link href="/prompts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Prompt
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Búsqueda</CardTitle>
            <CardDescription>Busca prompts por título o contenido</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar prompts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtra por categoría o favoritos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="w-full"
            >
              {showFavoritesOnly ? (
                <>
                  <Star className="mr-2 h-4 w-4 fill-current" />
                  Mostrando favoritos
                </>
              ) : (
                <>
                  <StarOff className="mr-2 h-4 w-4" />
                  Mostrar todos
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {prompts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {search || category !== "all" || showFavoritesOnly
                ? "No se encontraron prompts con esos filtros"
                : "Aún no has creado ningún prompt. ¡Crea tu primer prompt!"}
            </p>
            {!search && category === "all" && !showFavoritesOnly && (
              <Link href="/prompts/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primer Prompt
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  );
}

