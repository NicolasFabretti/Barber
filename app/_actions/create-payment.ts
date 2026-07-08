"use server";

import { Payment } from "mercadopago";
import { db } from "../_lib/prisma";
import { mercadoPago } from "../_lib/mercado-pago";

interface CreatePixPaymentProps {
  bookingId: string;
}

const createPayment = async ({ bookingId }: CreatePixPaymentProps) => {
  const booking = await db.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: true,
      user: true,
    },
  });
  if (!booking) {
    throw new Error("Agendamento não encontrado.");
  }

  const payment = new Payment(mercadoPago);

  const result = await payment.create({
    body: {
      transaction_amount: Number(booking.service.price),
      description: booking.service.name,
      payment_method_id: "pix",
      payer: {
        email:
          process.env.NODE_ENV === "development"
            ? "test_user_4187344111064142083@testuser.com"
            : booking.user.email!,
      },
      external_reference: bookingId,
    },
  });
  // Salva o vínculo entre o Booking e o pagamento do Mercado Pago
  await db.booking.update({
    where: { id: booking.id },
    data: { paymentId: String(result.id) },
  });

  return {
    qrCode: result.point_of_interaction?.transaction_data?.qr_code,
    qrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
  };
};

export default createPayment;

/* 1. result.point_of_interaction?.transaction_data
Quando você cria um pagamento Pix na API do Mercado Pago, a resposta (result) vem com um monte de informações — status, valor, etc. Uma parte específica dessa resposta, point_of_interaction.transaction_data, é onde ficam os dados específicos do Pix: o QR Code e o código copia-e-cola.
A resposta bruta do Mercado Pago tem essa forma (simplificada):
json{
  "id": 123456789,
  "status": "pending",
  "point_of_interaction": {
    "transaction_data": {
      "qr_code": "00020126580014br.gov.bcb.pix...",
      "qr_code_base64": "iVBORw0KGgoAAAANSUhEUgAA..."
    }
  }
}
Os dois campos que interessam:

qr_code → é o texto do Pix (o "copia e cola"). Você usaria isso num <textarea> pra o usuário copiar.
qr_code_base64 → é a imagem do QR Code já pronta, codificada em base64. Você usa isso direto numa tag <img> (ou next/image) pra desenhar o QR na tela.

2. Por que o ?. (optional chaining)
tsresult.point_of_interaction?.transaction_data?.qr_code
Isso é uma proteção: se por algum motivo o Mercado Pago não devolver point_of_interaction (ex: erro parcial, ou pagamento com outro método), o código não quebra tentando acessar uma propriedade de undefined — em vez de dar erro, retorna undefined silenciosamente.
3. O bloco do db.booking.update
tsawait db.booking.update({
  where: { id: booking.id },
  data: { paymentId: String(result.id) },
});
Isso é o que liga o pagamento do Mercado Pago com a sua reserva no banco. Lembra do campo paymentId String? que você adicionou no schema? É aqui que ele é preenchido.
Por que isso importa: quando o Mercado Pago mandar a notificação pro Webhook dizendo "o pagamento X foi aprovado", o Webhook vai saber qual Booking atualizar procurando no seu banco por paymentId: X. Sem esse vínculo salvo, não haveria como conectar as duas coisas.
String(result.id) — o result.id vem como number da API do Mercado Pago, mas seu campo no Prisma é String?, então precisa converter.
4. O return final
tsreturn {
  qrCode: result.point_of_interaction?.transaction_data?.qr_code,
  qrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
};
Isso é o que a Server Action devolve pro componente que a chamou — só os dois dados que o front-end realmente precisa pra desenhar a tela do Pix (o resto da resposta do Mercado Pago não interessa pro client).
*/
