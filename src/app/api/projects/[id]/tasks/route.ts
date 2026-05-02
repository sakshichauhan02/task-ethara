import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id: projectId } = await params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("Creating task for project:", projectId, "with data:", body);
    
    const { title, description, priority, assigneeId, dueDate } = body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status: "IN_PROGRESS",
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId || null,
        creatorId: session.user.id,
      },
    });

    console.log("Task created successfully:", task.id);
    return NextResponse.json(task);
  } catch (error: any) {
    console.error("Task creation error details:", {
      message: error.message,
      stack: error.stack,
      projectId
    });
    return NextResponse.json({ error: "Failed to create task", details: error.message }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await params;

  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: { assignee: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}
