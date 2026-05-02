import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status, priority, title, description, assigneeId, dueDate } = await req.json();

    const task = await prisma.task.update({
      where: { id },
      data: {
        status,
        priority,
        title,
        description,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });

    return NextResponse.json(task);
  } catch (error: any) {
    console.error("Task update error:", error);
    return NextResponse.json({ error: "Failed to update task", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
