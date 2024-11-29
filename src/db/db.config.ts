import { PrismaClient } from "@prisma/client";

// Initialize Prisma client using the environment variable
const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.DATABASE_URL, // Use the DATABASE_URL from environment variables
		},
	},
});

export default prisma;
