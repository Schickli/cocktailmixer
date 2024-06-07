import { NextResponse, NextRequest } from "next/server";
import { getIngredients } from "./ingredients";

export async function GET(req: Request) {
  try {
    const list = await getIngredients();
    return NextResponse.json(list, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
