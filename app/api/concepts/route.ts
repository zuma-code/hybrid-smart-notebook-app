import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const createConceptSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().default(""),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const concepts = await prisma.concept.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(concepts);
  } catch (error) {
    console.error("Error fetching concepts:", error);
    return NextResponse.json(
      { error: "Failed to fetch concepts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createConceptSchema.parse(body);

    const slug = slugify(data.title);

    // Check if concept with this slug already exists
    const existing = await prisma.concept.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A concept with this title already exists" },
        { status: 409 }
      );
    }

    const concept = await prisma.concept.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
      },
    });

    return NextResponse.json(concept, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating concept:", error);
    return NextResponse.json(
      { error: "Failed to create concept" },
      { status: 500 }
    );
  }
}

