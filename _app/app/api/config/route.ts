import { NextResponse, NextRequest } from "next/server";
import { setConfig, getConfig } from "./config";

export async function GET(req: Request) {
  try {
    const configData = await getConfig();
    return NextResponse.json(configData, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
      if (!req.body) throw new Error("No body provided");
      
      let data = await req.json()
      const res = await setConfig(data[0]);
      return NextResponse.json(res, { status: 200 });
  } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
