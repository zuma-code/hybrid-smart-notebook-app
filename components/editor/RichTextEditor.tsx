"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

// Importar algunos lenguajes comunes para syntax highlighting
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";

const lowlight = createLowlight();

// Registrar lenguajes
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("python", python);
lowlight.register("json", json);
lowlight.register("css", css);
lowlight.register("html", html);
lowlight.register("xml", html);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Escribe aquí...",
  disabled = false,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Usaremos CodeBlockLowlight en su lugar
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
    immediatelyRender: false,
  });

  // Sincronizar contenido externo
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className={cn("min-h-[400px] p-4 border rounded-md", className)}>
        <p className="text-muted-foreground">Cargando editor...</p>
      </div>
    );
  }

  return (
    <div className={cn("border rounded-md", className)}>
      {/* Toolbar básico */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            "px-2 py-1 rounded text-sm font-medium transition-colors",
            editor.isActive("bold")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            "px-2 py-1 rounded text-sm font-medium transition-colors",
            editor.isActive("italic")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={cn(
            "px-2 py-1 rounded text-sm font-medium transition-colors",
            editor.isActive("code")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          &lt;/&gt;
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "px-2 py-1 rounded text-sm font-medium transition-colors",
            editor.isActive("heading", { level: 1 })
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "px-2 py-1 rounded text-sm font-medium transition-colors",
            editor.isActive("heading", { level: 2 })
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "px-2 py-1 rounded text-sm font-medium transition-colors",
            editor.isActive("heading", { level: 3 })
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          H3
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "px-2 py-1 rounded text-sm font-medium transition-colors",
            editor.isActive("bulletList")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "px-2 py-1 rounded text-sm font-medium transition-colors",
            editor.isActive("orderedList")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          1.
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "px-2 py-1 rounded text-sm font-medium transition-colors",
            editor.isActive("blockquote")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          "
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("URL del enlace:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={cn(
            "px-2 py-1 rounded text-sm font-medium transition-colors",
            editor.isActive("link")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          🔗
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className={cn(
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none p-4 min-h-[400px] focus:outline-none",
          "[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[400px]",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
        )}
      />
    </div>
  );
}

