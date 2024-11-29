"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// Initialize Prisma client using the environment variable
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL, // Use the DATABASE_URL from environment variables
        },
    },
});
exports.default = prisma;
