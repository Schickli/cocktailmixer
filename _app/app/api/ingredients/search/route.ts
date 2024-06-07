import { NextResponse, NextRequest } from "next/server";
import { searchIngredients } from "../ingredients";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "";
    const ingredientResult = await searchIngredients(name);
    return NextResponse.json(ingredientResult, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
