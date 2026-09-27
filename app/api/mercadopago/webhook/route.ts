import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createServerClient } from "../../../../lib/supabase-server";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("WEBHOOK MERCADO PAGO:", body);

    if (body.type !== "payment" || !body.data?.id) {
      return NextResponse.json({ received: true });
    }

    const paymentId = String(body.data.id);

    const paymentClient = new Payment(client);

    let payment;

try {
  payment = await paymentClient.get({
    id: paymentId,
  });
} catch (error) {
  console.error("No se pudo obtener el pago:", error);

  // Mercado Pago usa IDs ficticios en la simulación
  if (!body.live_mode) {
    return NextResponse.json({ received: true });
  }

  return NextResponse.json(
    { error: "Could not retrieve payment" },
    { status: 500 }
  );
}

    if (!payment.id || payment.transaction_amount == null) {
      return NextResponse.json({ received: true });
    }

    const supabase = createServerClient();

    const { data: owner, error: ownerError } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "owner")
      .single();

    if (ownerError || !owner) {
      console.error("ERROR OWNER:", ownerError);
      return NextResponse.json(
        { error: "Owner not found" },
        { status: 500 }
      );
    }

    const { data: seller, error: sellerError } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "seller")
      .eq("owner_id", owner.id)
      .single();

    if (sellerError || !seller) {
      console.error("ERROR SELLER:", sellerError);
      return NextResponse.json(
        { error: "Seller not found" },
        { status: 500 }
      );
    }

    const { error: insertError } = await supabase
      .from("payments")
      .upsert(
        {
          owner_id: owner.id,
          seller_id: seller.id,
          mp_payment_id: String(payment.id),
          amount: payment.transaction_amount,
          paid_at: payment.date_approved ?? payment.date_created,
          status: payment.status,
        },
        {
          onConflict: "mp_payment_id",
        }
      );

    if (insertError) {
      console.error("ERROR GUARDANDO PAGO:", insertError);

      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("ERROR WEBHOOK:", error);

    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    );
  }
}