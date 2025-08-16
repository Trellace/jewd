'use server';

import { connectDB } from '@/lib/mongodb';
import { Message } from '@/lib/models/Message';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    
    // Count all messages
    const count = await Message.countDocuments();
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting message count:", error);
    return NextResponse.json({ error: "Failed to retrieve message count" }, { status: 500 });
  }
}
