/**
 * Utilidades para detectar y procesar enlaces wiki-style [[concepto]]
 */

/**
 * Detecta todos los enlaces wiki-style en un texto
 * Formato: [[concepto]] o [[concepto|texto alternativo]]
 */
export function extractWikiLinks(content: string): string[] {
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
  const links: string[] = [];
  let match;

  while ((match = wikiLinkRegex.exec(content)) !== null) {
    const linkText = match[1];
    // Si hay texto alternativo ([[concepto|texto]]), tomar solo el concepto
    const conceptName = linkText.split("|")[0].trim();
    if (conceptName) {
      links.push(conceptName);
    }
  }

  return [...new Set(links)]; // Remove duplicates
}

/**
 * Convierte enlaces wiki-style a HTML con links
 */
export function convertWikiLinksToHTML(
  content: string,
  basePath: string = "/concepts"
): string {
  return content.replace(
    /\[\[([^\]]+)\]\]/g,
    (match, linkText) => {
      const [conceptName, displayText] = linkText.split("|").map((s: string) => s.trim());
      const slug = slugify(conceptName);
      const display = displayText || conceptName;
      
      return `<a href="${basePath}/${slug}" class="text-primary underline hover:text-primary/80">${display}</a>`;
    }
  );
}

/**
 * Convierte texto a slug (debe coincidir con la función en utils.ts)
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Crea o actualiza enlaces bidireccionales entre notas
 */
export async function updateNoteLinks(
  noteType: "DailyNote" | "Concept",
  noteId: string,
  content: string
) {
  const links = extractWikiLinks(content);
  
  // Buscar conceptos que coincidan con los enlaces
  const conceptSlugs = links.map((link) =>
    link
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );

  // Aquí haríamos la llamada a la API para crear/actualizar los enlaces
  // Por ahora retornamos los slugs encontrados
  return conceptSlugs;
}

