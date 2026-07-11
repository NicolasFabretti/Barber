"use server";

import { Order } from "mercadopago";
import { db } from "../_lib/prisma";
import { mercadoPago } from "../_lib/mercado-pago";
import crypto from "crypto";

interface CreatePixPaymentProps {
  bookingId: string;
}

const createPayment = async ({ bookingId }: CreatePixPaymentProps) => {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { service: true, user: true },
  });

  if (!booking) {
    throw new Error("Agendamento não encontrado.");
  }

  const order = new Order(mercadoPago);

  const result = await order.create({
    body: {
      type: "online",
      processing_mode: "automatic",
      total_amount: Number(booking.service.price).toFixed(2),
      external_reference: bookingId,
      payer: {
        email: booking.user.email!,
      },
      transactions: {
        payments: [
          {
            amount: Number(booking.service.price).toFixed(2),
            payment_method: {
              id: "pix",
              type: "bank_transfer",
            },
          },
        ],
      },
    },
    requestOptions: {
      idempotencyKey: crypto.randomUUID(),
    },
  });

  const paymentTransaction = result.transactions?.payments?.[0];

  await db.booking.update({
    where: { id: booking.id },
    data: { paymentId: String(paymentTransaction?.id ?? result.id) },
  });

  return {
    qrCode: paymentTransaction?.payment_method?.qr_code,
    qrCodeBase64: paymentTransaction?.payment_method?.qr_code_base64,
  };
};

export default createPayment;

/*
Vamos destrinchar o create-payment.ts linha por linha, agora que sabemos que funciona.
ts"use server";

import { Order } from "mercadopago";
import { db } from "../_lib/prisma";
import { mercadoPago } from "../_lib/mercado-pago";
import crypto from "crypto";

"use server" — marca esse arquivo como Server Action, roda só no backend
Order — a classe do SDK que representa a API de Orders (mais nova que Payment, é a que dá suporte a teste de Pix)
mercadoPago — o client configurado com o Access Token (do app/_lib/mercado-pago.ts)
crypto — módulo nativo do Node, usado só pra gerar um ID único (idempotencyKey)

tsinterface CreatePixPaymentProps {
  bookingId: string;
}

const createPayment = async ({ bookingId }: CreatePixPaymentProps) => {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { service: true, user: true },
  });

  if (!booking) {
    throw new Error("Agendamento não encontrado.");
  }

Busca o booking no banco pelo ID recebido, trazendo junto o service (pra saber o preço) e o user (pro e-mail em produção)
Se não encontrar, lança erro — protege contra bookingId inválido

ts  const isTestMode = process.env.NODE_ENV === "development";

NODE_ENV é definido automaticamente pelo Next.js: "development" quando roda npm run dev, "production" quando é deploy/build de produção
Isso permite alternar o comportamento sem você precisar mudar código manualmente

ts  const order = new Order(mercadoPago);

Instancia o "cliente" da API de Orders, passando a configuração (token) que já criamos

ts  const result = await order.create({
    body: {
      type: "online",
      processing_mode: "automatic",

type: "online" — único valor aceito pela API pra esse tipo de pagamento (obrigatório, sempre esse texto)
processing_mode: "automatic" — processa a transação de uma vez só (existe também "manual", pra fluxos mais complexos que você não precisa agora)

ts      total_amount: Number(booking.service.price).toFixed(2),

booking.service.price vem do Prisma como tipo Decimal — Number() converte pra número puro, .toFixed(2) formata como string com 2 casas decimais (a API exige string, não number, nesse campo)

ts      external_reference: bookingId,

Um identificador seu, que você define — serve pra rastrear depois qual booking esse pagamento pertence (aparece de volta na consulta da ordem)

ts      payer: isTestMode
        ? {
            email: "test_user_br@testuser.com",
            first_name: "APRO",
          }
        : {
            email: booking.user.email!,
          },

Em desenvolvimento: usa o e-mail de teste fixo documentado pela MP, e first_name: "APRO" — esse valor específico sinaliza "simule uma aprovação automática"
Em produção: usa o e-mail real do usuário logado (booking.user.email! — o ! diz ao TypeScript "confio que não é null", já que seu User.email é opcional no schema)

ts      transactions: {
        payments: [
          {
            amount: Number(booking.service.price).toFixed(2),
            payment_method: {
              id: "pix",
              type: "bank_transfer",
            },
          },
        ],
      },
    },

Estrutura obrigatória da API de Orders: mesmo tendo só um pagamento, ele fica dentro de um array payments: [...]
payment_method.id: "pix" + type: "bank_transfer" — é assim que você especifica que quer Pix (Pix é tecnicamente categorizado como "transferência bancária" pelo Mercado Pago)

ts    requestOptions: {
      idempotencyKey: crypto.randomUUID(),
    },
  });

idempotencyKey — obrigatório na API de Orders. Evita que, se a requisição for reenviada por engano (falha de rede, retry automático), o Mercado Pago crie dois pagamentos duplicados para a mesma ação. Cada chamada gera uma chave nova e aleatória.

ts  const paymentTransaction = result.transactions?.payments?.[0];

Navega até o primeiro (e único) pagamento dentro da resposta — a estrutura da API de Orders aninha tudo dentro de transactions.payments[], diferente da API de Payments antiga que retornava tudo "solto"

ts  await db.booking.update({
    where: { id: booking.id },
    data: { paymentId: String(paymentTransaction?.id ?? result.id) },
  });

Salva o vínculo: paymentTransaction?.id é o ID do pagamento específico (ex: PAY01KX6YVFPTG5BQZD8VVHDTK62S) — é esse ID que vai aparecer depois na notificação do Webhook, então precisamos guardá-lo pra saber qual booking atualizar
O ?? result.id é um fallback de segurança, caso paymentTransaction não exista por algum motivo

ts  return {
    qrCode: paymentTransaction?.payment_method?.qr_code,
    qrCodeBase64: paymentTransaction?.payment_method?.qr_code_base64,
  };
};

export default createPayment;

Retorna só o que o front-end precisa: o texto do Pix e a imagem em base64 */
