import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log("WEBHOOK MERCADO PAGO:", body);

  return NextResponse.json({ received: true });
}