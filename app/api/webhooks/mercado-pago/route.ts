// app/api/webhooks/mercado-pago/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Payment } from "mercadopago";
import { mercadoPago } from "@/app/_lib/mercado-pago";
import { db } from "@/app/_lib/prisma";

function isValidSignature(req: NextRequest, dataId: string): boolean {
  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");

  if (!xSignature || !xRequestId) return false;

  const parts = xSignature.split(",");
  let ts = "";
  let hash = "";

  parts.forEach((part) => {
    const [key, value] = part.split("=");
    if (key?.trim() === "ts") ts = value?.trim();
    if (key?.trim() === "v1") hash = value?.trim();
  });

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  const hmac = crypto
    .createHmac("sha256", process.env.MERCADO_PAGO_WEBHOOK_SECRET!)
    .update(manifest)
    .digest("hex");

  return hmac === hash;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return NextResponse.json({ received: true });
    }

    if (!isValidSignature(req, String(paymentId))) {
      console.warn(
        "Assinatura de webhook inválida — possível requisição forjada",
      );
      return NextResponse.json(
        { error: "Assinatura inválida" },
        { status: 401 },
      );
    }

    const payment = new Payment(mercadoPago);
    const paymentInfo = await payment.get({ id: paymentId });

    const status = mapStatus(paymentInfo.status);
    if (!status) return NextResponse.json({ received: true });

    await db.booking.updateMany({
      where: { paymentId: String(paymentId) },
      data: { status },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook do Mercado Pago:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

function mapStatus(mpStatus?: string) {
  switch (mpStatus) {
    case "approved":
      return "APPROVED" as const;
    case "rejected":
    case "cancelled":
      return "REJECTED" as const;
    default:
      return null;
  }
}
