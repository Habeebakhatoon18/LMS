console.log("START");

import { PrismaClient } from "@prisma/client";
import pkg from "@prisma/client/package.json" with { type: "json" };

console.log("Version:", pkg.version);

const prisma = new PrismaClient();

console.log("CLIENT CREATED");

await prisma.$connect();

console.log("CONNECTED");

await prisma.$disconnect();

console.log("END");