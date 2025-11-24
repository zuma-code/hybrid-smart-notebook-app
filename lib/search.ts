import Fuse, { FuseResultMatch } from "fuse.js";

export interface SearchableItem {
  id: string;
  type: "DailyNote" | "Concept" | "Prompt" | "Image";
  title: string;
  content?: string;
  url: string;
  date?: string;
  category?: string;
  tags?: string[];
}

export interface SearchResult {
  item: SearchableItem;
  score: number;
  matches?: readonly FuseResultMatch[];
}

/**
 * Configura Fuse.js para búsqueda difusa
 */
export function createSearchIndex(items: SearchableItem[]) {
  return new Fuse(items, {
    keys: [
      { name: "title", weight: 0.7 },
      { name: "content", weight: 0.3 },
      { name: "tags", weight: 0.2 },
    ],
    threshold: 0.4, // 0 = exact match, 1 = match anything
    includeMatches: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
  });
}

/**
 * Realiza una búsqueda en los items
 */
export function searchItems(
  items: SearchableItem[],
  query: string
): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const fuse = createSearchIndex(items);
  const results = fuse.search(query);

  return results.map((result) => ({
    item: result.item,
    score: result.score || 0,
    matches: result.matches,
  }));
}

/**
 * Agrupa resultados por tipo
 */
export function groupResultsByType(
  results: SearchResult[]
): Record<string, SearchResult[]> {
  return results.reduce((acc, result) => {
    const type = result.item.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);
}

/**
 * Resalta texto con matches
 */
export function highlightText(
  text: string,
  matches: readonly FuseResultMatch[] | undefined
): string {
  if (!matches || matches.length === 0) {
    return text;
  }

  let highlighted = text;
  const sortedMatches = matches
    .flatMap((m) => m.indices)
    .sort((a, b) => b[0] - a[0]); // Ordenar de mayor a menor para no afectar índices

  for (const [start, end] of sortedMatches) {
    const before = highlighted.substring(0, start);
    const match = highlighted.substring(start, end + 1);
    const after = highlighted.substring(end + 1);
    highlighted = `${before}<mark class="bg-yellow-200 dark:bg-yellow-800">${match}</mark>${after}`;
  }

  return highlighted;
}

