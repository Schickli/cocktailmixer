import { NextResponse, NextRequest } from "next/server";
import { getMachineStatus } from "./status";

export async function GET(req: Request) {
  try {
    const mostUsed = await getMachineStatus();
    return NextResponse.json(mostUsed, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}