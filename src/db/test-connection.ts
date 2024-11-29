// src/db/test-connection.ts

import prisma from "./db.config";

type QueryResult = {
	now: Date;
};

async function testConnection() {
	try {
		// Attempt to query the database
		const result = await prisma.$queryRaw<QueryResult[]>`SELECT NOW()`;
		console.log("✅ Successfully connected to the database");
		console.log("Database time:", result[0].now);

		// Optional: Test a connection to one of your models
		const campusCount = await prisma.campus.count();
		console.log("Number of campuses in database:", campusCount);

		return true;
	} catch (error) {
		console.error("❌ Error connecting to the database:", error);
		return false;
	} finally {
		await prisma.$disconnect();
	}
}

// Execute the test
testConnection().catch(console.error);
