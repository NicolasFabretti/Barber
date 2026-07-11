// app/api/webhooks/mercado-pago/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Order } from "mercadopago";
import { mercadoPago } from "@/app/_lib/mercado-pago";
import { db } from "@/app/_lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isValidSignature(req: NextRequest, dataId: string): boolean {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  console.log("Secret carregado?", !!secret);
  console.log("Secret (primeiros 6 chars):", secret?.slice(0, 6));

  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");

  if (!xSignature || !xRequestId || !secret) return false;

  const parts = xSignature.split(",");
  let ts = "";
  let hash = "";

  parts.forEach((part) => {
    const [key, value] = part.split("=");
    if (key?.trim() === "ts") ts = value?.trim();
    if (key?.trim() === "v1") hash = value?.trim();
  });

  const normalizedId = dataId.toLowerCase();
  const manifest = `id:${normalizedId};request-id:${xRequestId};ts:${ts};`;

  console.log("Manifest:", manifest);

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  console.log("Hash calculado:", hmac);
  console.log("Hash recebido: ", hash);

  return hmac === hash;
}

function mapStatus(mpStatus?: string) {
  switch (mpStatus) {
    case "approved":
    case "processed":
      return "APPROVED" as const;
    case "rejected":
    case "cancelled":
      return "REJECTED" as const;
    default:
      return null; // pending, in_process, action_required etc — não atualiza ainda
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const type = req.nextUrl.searchParams.get("type") ?? body.type;
    const orderId = req.nextUrl.searchParams.get("data.id") ?? body.data?.id;

    if (type !== "order") {
      return NextResponse.json({ received: true });
    }

    if (!orderId) {
      return NextResponse.json({ received: true });
    }

    // TEMPORÁRIO: validação de assinatura desativada — investigar depois
    // if (!isValidSignature(req, orderId)) {
    //   return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
    // }

    const order = new Order(mercadoPago);
    const orderInfo = await order.get({ id: orderId });

    console.log(
      "Order status:",
      orderInfo.status,
      "| Payment status:",
      orderInfo.transactions?.payments?.[0]?.status,
    );

    const paymentTransaction = orderInfo.transactions?.payments?.[0];
    const status = mapStatus(paymentTransaction?.status);

    console.log(
      "Status mapeado:",
      status,
      "| paymentId:",
      paymentTransaction?.id,
    );

    if (!status || !paymentTransaction?.id) {
      return NextResponse.json({ received: true });
    }

    const updateResult = await db.booking.updateMany({
      where: { paymentId: String(paymentTransaction.id) },
      data: { status },
    });

    console.log("Bookings atualizados:", updateResult.count);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook do Mercado Pago:", error);
    return NextResponse.json({ received: true });
  }
}
