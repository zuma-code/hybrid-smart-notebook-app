"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { getTodayDateString } from "@/lib/utils";

interface QuickCaptureProps {
  trigger?: React.ReactNode;
  defaultDate?: string;
  onNoteCreated?: () => void;
}

export function QuickCapture({ trigger, defaultDate, onNoteCreated }: QuickCaptureProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(defaultDate || getTodayDateString());
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setDate(defaultDate || getTodayDateString());
      setTitle("");
    }
  }, [open, defaultDate]);

  const handleCreate = async () => {
    if (!date) return;

    setLoading(true);
    try {
      const res = await fetch("/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          title: title.trim() || undefined,
          content: "",
        }),
      });

      if (res.ok) {
        const newNote = await res.json();
        setOpen(false);
        if (onNoteCreated) {
          onNoteCreated();
        }
        router.push(`/daily/${newNote.id}`);
      } else {
        console.error("Error creating note");
      }
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Daily Note</DialogTitle>
          <DialogDescription>
            Crea una nueva nota diaria. Puedes crear múltiples notas para el mismo día.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="title">Título (Opcional)</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Reunión de equipo, Ideas de proyecto..."
              className="mt-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCreate();
                }
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={loading || !date}>
              <Calendar className="mr-2 h-4 w-4" />
              {loading ? "Creando..." : "Crear Nota"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
