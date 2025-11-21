import { ConceptList } from "@/components/concepts/ConceptList";

export default function ConceptsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conceptos</h1>
          <p className="text-muted-foreground">
            Tu biblioteca de conceptos de programación
          </p>
        </div>
      </div>
      <ConceptList />
    </div>
  );
}

