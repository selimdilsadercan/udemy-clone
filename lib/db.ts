import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV !== "production")
  globalThis.prisma = new PrismaClient();

const db = globalThis.prisma || new PrismaClient();

export default db;
