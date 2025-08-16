'use server';

import { connectDB } from '@/lib/mongodb';
import { Message } from '@/lib/models/Message';
import { NextRequest, NextResponse } from 'next/server';

// /api/messages/[id]
export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();

    const { action } = await req.json();
    const id = await context.params.id;

    if (!["up", "down"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const update = action === "up" ? 1 : -1;

    const message = await Message.findByIdAndUpdate(
      id,
      { $inc: { upvotes: update } },
      { new: true }
    );

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("Error updating upvotes:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}