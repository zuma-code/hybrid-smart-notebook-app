import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

/**
 * TipTap extension for wiki-style links [[concept]]
 * This extension detects and renders wiki-links as clickable elements
 */
export const WikiLink = Node.create({
  name: "wikiLink",

  group: "inline",

  inline: true,

  atom: true,

  addAttributes() {
    return {
      text: {
        default: null,
      },
      slug: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="wiki-link"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-type": "wiki-link",
        class: "wiki-link inline-flex items-center px-1.5 py-0.5 rounded text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800",
      }),
      `[[${HTMLAttributes.text || ""}]]`,
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("wikiLink"),
        props: {
          decorations: ({ doc }) => {
            const decorations: Decoration[] = [];
            const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;

            doc.descendants((node, pos) => {
              if (node.isText) {
                let match;
                while ((match = wikiLinkRegex.exec(node.text || "")) !== null) {
                  const from = pos + match.index;
                  const to = from + match[0].length;
                  const linkText = match[1].trim();
                  const slug = linkText
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/[\s_-]+/g, "-")
                    .replace(/^-+|-+$/g, "");

                  const decoration = Decoration.inline(from, to, {
                    class: "wiki-link bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-1 rounded cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800",
                    "data-wiki-link": linkText,
                    "data-wiki-slug": slug,
                  });

                  decorations.push(decoration);
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

