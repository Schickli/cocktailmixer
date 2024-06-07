import { NextResponse, NextRequest } from "next/server";
import { getPossibleCocktails } from "../cocktails";

export async function GET(req: Request) {
  try {
    const possible = await getPossibleCocktails();
    return NextResponse.json(possible, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}