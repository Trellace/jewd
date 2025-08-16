'use server';

import { connectDB } from '@/lib/mongodb';
import { Message } from '@/lib/models/Message';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { message, location, emoji } = body;

    if (!message || !location?.lat || !location?.lng) {
      return NextResponse.json({ error: 'Message or location missing' }, { status: 400 });
    }

    // Check message count
    const count = await Message.countDocuments();

    if (count >= 2500) {
      // Delete oldest message (based on createdAt)
      const oldest = await Message.findOne().sort({ createdAt: 1 });
      if (oldest) {
        await Message.deleteOne({ _id: oldest._id });
      }
    }

    const newMessage = new Message({
      message,
      location,
      emoji,
      upvotes: 0
    });

    console.log(newMessage);
    await newMessage.save();

    return NextResponse.json({ 
      message: 'Message created successfully',
      data: newMessage
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    // Fetch all messages, sorted by newest first
    const messages = await Message.find().sort({ createdAt: -1 });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}