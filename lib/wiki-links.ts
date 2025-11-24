/**
 * Utility functions for handling wiki-style links [[concept]]
 */

/**
 * Extract all wiki-style links from HTML content
 * Matches patterns like [[concept name]] or [[concept-name]]
 */
export function extractWikiLinks(content: string): string[] {
  // Match [[...]] patterns, allowing for spaces, hyphens, and alphanumeric characters
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
  const matches: string[] = [];
  let match;

  while ((match = wikiLinkRegex.exec(content)) !== null) {
    const linkText = match[1].trim();
    if (linkText) {
      matches.push(linkText);
    }
  }

  // Remove duplicates
  return [...new Set(matches)];
}

/**
 * Convert wiki-link text to a slug
 */
export function wikiLinkToSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Convert wiki-links in HTML to actual links
 * This is used for rendering in read-only mode
 */
export function convertWikiLinksToHTML(content: string): string {
  return content.replace(
    /\[\[([^\]]+)\]\]/g,
    (match, linkText) => {
      const slug = wikiLinkToSlug(linkText);
      return `<a href="/concepts/${slug}" class="wiki-link" data-wiki-link="${linkText}">${linkText}</a>`;
    }
  );
}





