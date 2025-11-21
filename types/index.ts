export type NoteType = "DailyNote" | "Concept" | "Prompt";

export type PromptCategory = "general" | "debugging" | "refactoring" | "learning";

export interface DailyNote {
  id: string;
  date: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Concept {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: PromptCategory;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  id: string;
  filename: string;
  path: string;
  alt: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface NoteTag {
  id: string;
  noteType: NoteType;
  noteId: string;
  tagId: string;
  tag: Tag;
  createdAt: Date;
}

export interface NoteLink {
  id: string;
  fromNoteType: "DailyNote" | "Concept";
  fromNoteId: string;
  toNoteType: "DailyNote" | "Concept";
  toNoteId: string;
  linkType: string;
  createdAt: Date;
}

