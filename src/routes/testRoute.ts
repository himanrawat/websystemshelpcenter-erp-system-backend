import { Router, Request, Response } from "express";
import prisma from "../db/db.config";

const router = Router();

// Database connection test route
router.get("/db-test", async (req: Request, res: Response) => {
	try {
		// Test the database connection with a query
		const admins = await prisma.admin.findMany({
			select: { id: true, name: true, email: true },
		});
		res.status(200).json({
			success: true,
			message: "Successfully connected to the database!",
			data: admins,
		});
	} catch (error: unknown) {
		// Cast error to Error to safely access its message
		const err = error as Error;
		console.error("Database connection test error:", err.message);
		res.status(500).json({
			success: false,
			message: "Failed to connect to the database.",
			error: err.message,
		});
	}
});

export default router;
