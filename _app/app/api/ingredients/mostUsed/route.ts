import { NextResponse, NextRequest } from "next/server";
import { getMostUsedIngredients } from "../ingredients";

export async function GET(req: Request) {
  try {
    const mostUsed = await getMostUsedIngredients();
    return NextResponse.json(mostUsed, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}