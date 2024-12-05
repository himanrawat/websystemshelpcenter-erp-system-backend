import dotenv from "dotenv";
import prisma from "./db/db.config";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import cors from "cors";

// Add startup logging
console.log("Application starting...");
console.log("Node version:", process.version);
console.log("Environment:", process.env.NODE_ENV);

const app = express();

// Set port from environment variables
const PORT: number = parseInt(process.env.PORT || "8080");
console.log("Port configured:", PORT);

// Handle uncaught errors
process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
	console.error("Uncaught Exception:", error);
	// Give time for logging before exiting
	setTimeout(() => process.exit(1), 1000);
});

// CORS Configuration
const allowedOrigins = [
	"https://campus-erp-admin.vercel.app",
	"http://localhost:3000",
];

// Add Azure URL if present
if (process.env.AZURE_WEBSITE_HOSTNAME) {
	allowedOrigins.push(`https://${process.env.AZURE_WEBSITE_HOSTNAME}`);
}

// Middleware setup
app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
);

console.log("CORS configured for origins:", allowedOrigins);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint with detailed info
app.get("/", (req: Request, res: Response) => {
	console.log("Health check endpoint hit");
	res.send({
		message: "API Working with /api/v1",
		version: process.version,
		environment: process.env.NODE_ENV,
		timestamp: new Date().toISOString(),
	});
});

// Application routes
app.use(routes);

// Database connection with retry logic
const connectDB = async (retries = 5) => {
	while (retries > 0) {
		try {
			await prisma.$connect();
			console.log("Database connected successfully");
			return true;
		} catch (error) {
			console.error(
				`Database connection attempt failed. Retries left: ${retries - 1}`
			);
			console.error("Error:", error);
			retries--;
			if (retries === 0) {
				console.error("All database connection attempts failed");
				return false;
			}
			// Wait for 5 seconds before retrying
			await new Promise((resolve) => setTimeout(resolve, 5000));
		}
	}
	return false;
};

// Enhanced error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.error("Error handling middleware caught:", {
		error: err.message,
		stack: err.stack,
		path: req.path,
		method: req.method,
	});

	res.status(500).json({
		message: "Internal Server Error",
		success: false,
		error:
			process.env.NODE_ENV === "production"
				? "Internal Server Error"
				: err.message || "Unknown Error",
	});
});

// Start server only after attempting database connection
(async () => {
	const dbConnected = await connectDB();

	if (!dbConnected && process.env.NODE_ENV === "production") {
		console.error("Failed to connect to database in production - exiting");
		process.exit(1);
	}

	app.listen(PORT, () => {
		console.log(`Server environment: ${process.env.NODE_ENV || "development"}`);
		console.log(`Server is running on port ${PORT}`);
		console.log("Database URL configured:", !!process.env.DATABASE_URL);
		console.log("JWT Secret configured:", !!process.env.JWT_SECRET);

		if (process.env.AZURE_WEBSITE_HOSTNAME) {
			console.log(`Running on Azure: ${process.env.AZURE_WEBSITE_HOSTNAME}`);
		}
	});
})();
