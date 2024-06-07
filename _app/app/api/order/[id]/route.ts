import { NextResponse, NextRequest } from "next/server";
import { getOrderById } from "../order";

export async function GET(
  req: Request,
  { params }: { params: { id: number } }
) {
  try {
    const ingredient = await getOrderById(params.id);
    return NextResponse.json(ingredient, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
