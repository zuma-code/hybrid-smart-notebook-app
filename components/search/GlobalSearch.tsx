"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchResults } from "./SearchResults";
import { searchItems, SearchResult, SearchableItem } from "@/lib/search";
import { Skeleton } from "@/components/ui/skeleton";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SearchableItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Cargar items al abrir el diálogo
  useEffect(() => {
    if (open) {
      fetchItems();
      // Focus en el input después de un pequeño delay
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Reset al cerrar
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/search");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      } else {
        console.error("Error fetching search items:", res.status, res.statusText);
      }
    } catch (error) {
      console.error("Error fetching search items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Búsqueda con debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    // Solo buscar si tenemos items cargados
    if (items.length === 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      const searchResults = searchItems(items, query);
      setResults(searchResults);
      setSelectedIndex(0);
    }, 200); // Debounce de 200ms

    return () => clearTimeout(timeoutId);
  }, [query, items]);

  // Manejar atajo de teclado Cmd+K o Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }

      // Cerrar con Escape
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Navegación con teclado
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        const selectedResult = results[selectedIndex];
        if (selectedResult) {
          router.push(selectedResult.item.url);
          setOpen(false);
        }
      }
    },
    [results, selectedIndex, router]
  );

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <>
      {/* Botón trigger en el header */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Buscar...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Diálogo de búsqueda */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Búsqueda Global</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Buscar en notas, conceptos, prompts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9"
              />
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : query && results.length > 0 ? (
              <SearchResults
                results={results}
                selectedIndex={selectedIndex}
                onSelect={handleSelect}
                query={query}
              />
            ) : query && items.length > 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No se encontraron resultados para "{query}"
              </div>
            ) : query && items.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Cargando items de búsqueda...
              </div>
            ) : null}

            {!query && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Command className="h-4 w-4" />
                  <span>Escribe para buscar</span>
                </div>
                <p className="text-xs">
                  Busca en todas tus notas, conceptos, prompts e imágenes
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

