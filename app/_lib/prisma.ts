import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var cachedPrisma: PrismaClient;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined. Add it to your .env file.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const clientOptions = {
  adapter,
};

let prismaConnection: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prismaConnection = new PrismaClient(clientOptions);
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient(clientOptions);
  }
  prismaConnection = global.cachedPrisma;
}

export const db = prismaConnection;

/*Fluxo completo

Aplicação inicia
       ↓
Existe global.cachedPrisma?
       ↓
      NÃO
       ↓
Cria new PrismaClient()
       ↓
Salva em global.cachedPrisma
       ↓
Exporta db

Depois de um Hot Reload:

Aplicação recarrega
       ↓
Existe global.cachedPrisma?
       ↓
      SIM
       ↓
Reutiliza a instância existente
       ↓
Não cria nova conexão*/
