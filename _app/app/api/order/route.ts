import { NextResponse, NextRequest } from "next/server";
import { orderCocktail, getOrders } from "./order";

export async function POST(req: Request) {
  try {
    let data = await req.json();
    const id = await orderCocktail(data.idDrink, data.glassSize);
    return NextResponse.json(
      { message: "Producing", orderId: id },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    let data = await req.json();
    const id = await getOrders();
    return NextResponse.json(
      { message: "Producing", orderId: id },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
