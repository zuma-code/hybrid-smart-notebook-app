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
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setDate(defaultDate || getTodayDateString());
      setTitle("");
    }
  }, [open, defaultDate]);

  const handleCreate = async () => {
    if (date) {
      try {
        const res = await fetch("/api/daily", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, title: title || undefined, content: "" }),
        });

        if (res.ok) {
          const newNote = await res.json();
          router.push(`/daily/${newNote.id}`);
          setOpen(false);
          onNoteCreated?.();
        } else {
          console.error("Failed to create daily note:", await res.json());
        }
      } catch (error) {
        console.error("Error creating daily note:", error);
      }
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
            Selecciona la fecha y opcionalmente un título para tu nueva nota diaria
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
            <Label htmlFor="title">Título (opcional)</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Ideas para el proyecto X"
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate}>
              <Calendar className="mr-2 h-4 w-4" />
              Crear Nota
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



