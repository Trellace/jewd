//POST METHOD FOR SENDING INFO INTO THE DB
import { connectDB } from "lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  return new NextResponse("connected");
}
