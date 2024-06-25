import { NextResponse, NextRequest } from "next/server";
import { orderCocktail, getOrders } from "./order";
import { OrderRequest } from "@/lib/order";

export async function POST(req: Request) {
  try {
    let data = await req.json() as OrderRequest;
    const id = await orderCocktail(data.idBaseDrink, data.glassSize, data.ingredients);
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
