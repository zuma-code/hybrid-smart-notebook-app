"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BookOpen, MessageSquare, Image as ImageIcon, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  dailyNotes: number;
  concepts: number;
  prompts: number;
  images: number;
}

interface TodayNote {
  id: string;
  date: string;
  title?: string;
  content: string;
}

interface RecentActivityItem {
  type: "DailyNote" | "Concept" | "Prompt";
  id: string;
  title: string;
  date: string;
  url: string;
  category?: string;
  isFavorite?: boolean;
}

interface DashboardData {
  stats: DashboardStats;
  todayNote: TodayNote | null;
  recentActivity: RecentActivityItem[];
}

const TYPE_LABELS: Record<string, string> = {
  DailyNote: "Nota diaria",
  Concept: "Concepto",
  Prompt: "Prompt",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  DailyNote: <Calendar className="h-4 w-4" />,
  Concept: <BookOpen className="h-4 w-4" />,
  Prompt: <MessageSquare className="h-4 w-4" />,
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const dashboardData = await res.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    dailyNotes: 0,
    concepts: 0,
    prompts: 0,
    images: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido a tu cuaderno inteligente de programación
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Notes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dailyNotes}</div>
            <p className="text-xs text-muted-foreground">
              Notas diarias creadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conceptos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.concepts}</div>
            <p className="text-xs text-muted-foreground">
              Conceptos guardados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prompts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prompts}</div>
            <p className="text-xs text-muted-foreground">
              Prompts guardados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imágenes</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.images}</div>
            <p className="text-xs text-muted-foreground">
              Imágenes subidas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Tus últimas notas, conceptos y prompts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {data.recentActivity.map((item) => (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={item.url}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors group"
                  >
                    <div className="flex-shrink-0 text-muted-foreground">
                      {TYPE_ICONS[item.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {TYPE_LABELS[item.type]}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay actividad reciente
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nota del Día</CardTitle>
            <CardDescription>
              Tu entrada diaria de hoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.todayNote ? (
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium mb-1">
                    {data.todayNote.title || formatDate(data.todayNote.date)}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {data.todayNote.content.replace(/<[^>]*>/g, "") || "Sin contenido"}
                  </p>
                </div>
                <Link href={`/daily/${data.todayNote.id}`}>
                  <Button variant="outline" className="w-full">
                    Ver nota completa
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Aún no has creado una nota para hoy
                </p>
                <Link href="/daily">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear nota de hoy
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
          <CardDescription>
            Accede rápidamente a las funciones principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-3">
            <Link href="/daily">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Nueva Nota Diaria
              </Button>
            </Link>
            <Link href="/concepts/new">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Nuevo Concepto
              </Button>
            </Link>
            <Link href="/prompts/new">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Nuevo Prompt
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
