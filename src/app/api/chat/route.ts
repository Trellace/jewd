import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages must be an array" },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY is not set in the environment variables");
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    // Optional: you can prepend your developer prompt here if needed
    const devPrompt = `
        Using the following information, find 5 house for sale in the region of the location in Australia provided that fit the conditions set below and provide a 0-10 score for each of the following metrics depending on how well the property fits the client’s needs.

        Provide a candid 0-10 int score and short reason for it on each of the following metrics:

        1. Location & Accessibility
        •	Proximity to work, schools, public transport, shops.
        •	Ease of access to major roads.
        •	Traffic noise & commute times.
        2. Neighbourhood Safety & Amenities
        •	Crime rates and perceived safety.
        •	Availability of parks, cafes, gyms, healthcare.
        •	Community vibe and cleanliness.
        3. Property Condition & Layout
        •	Age of the house and quality of construction.
        •	Functional layout, storage space, natural light.
        •	Need for renovations or repairs.
        4. Size & Land Use
        •	Land size (for potential future builds/extensions).
        •	Internal square footage and number of usable rooms.
        •	Yard, garden, or outdoor living space.
        5. Affordability & Ongoing Costs
        •	Purchase/rent price relative to budget.
        •	Rates, utilities, strata fees (if applicable).
        •	Energy efficiency (insulation, solar, water tanks).
        6. Future Value & Growth Potential
        •	Local market trends and infrastructure projects.
        •	Demand in the area (school zones, development plans).
        •	Resale or rental appeal.

        Also provide a short overall summary on each property.

        Return this data as properly indented json in the format of: {
            address: string,
            coordinates: string,
            price: string,
            image url: string,
            seller url: string,
            summary: string,
            metrics: {
                metric_index: int,
                metric_score: int,
                metric_reason: string
            }
        }
    `;

    const messages = [
      { role: "system", content: devPrompt },
      ...body.messages,
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: messages,
      tools: [
        { type: "web_search_preview" },
      ],
    });

    const message = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ output: message }, { status: 200 });
  } catch (error) {
    console.error("Error processing AI request:", error);
    return NextResponse.json(
      {
        error: "Failed to process your request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}