// import dotenv from "dotenv";
// dotenv.config();

// import express, { Request, Response } from "express";
// import routes from "./routes/index";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import cluster from "cluster";
// import os from "os";

// const app = express();

// const PORT: number = parseInt(process.env.PORT || "4000");

// // if (cluster.isPrimary) {
// //   const numCPUs = os.cpus().length;

// //   console.log(`Master ${process.pid} is running`);
// //   // Fork workers.
// //   for (let i = 0; i < numCPUs; i++) {
// //     cluster.fork();
// //   }

// //   cluster.on('exit', (worker, code, signal) => {
// //     console.log(`worker ${worker.process.pid} died`);
// //   });
// // } else {
// // Workers can share any TCP connection
// // In this case, it is an HTTP server

// app.get("/", (req: Request, res: Response) => {
// 	return res.send({ message: "API Working with /api/v1" });
// });

// app.use(cors());
// app.use(express.json());

// // app.use(cors({ origin: 'https://campus-erp-admin.vercel.app' }));

// app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }));
// app.use(routes);

// app.listen(PORT, () =>
// 	console.log(
// 		`Worker ${process.pid} started server on PORT http://localhost:${PORT}`
// 	)
// );
// // }

import dotenv from "dotenv";
import prisma from "./db/db.config";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Set port from environment variables or fallback to 8080
const PORT: number = parseInt(process.env.PORT || "8080");

// Middleware to parse incoming requests
app.use(
	cors({
		origin: ["https://campus-erp-admin.vercel.app", "http://localhost:3000"],
		credentials: true, // Allows credentials to be sent along with requests
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
	console.log("Root endpoint hit");
	res.send({ message: "API Working with /api/v1" });
});

// Application routes
app.use(routes);

// Prisma database connection
(async () => {
	try {
		await prisma.$connect();
		console.log("Database connected successfully");
	} catch (error) {
		console.error("Error connecting to the database:", error);
		process.exit(1); // Exit process if database connection fails
	}
})();

// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.error("Unhandled Error:", err);
	res.status(500).json({
		message: "Internal Server Error",
		success: false,
		error: err.message || "Unknown Error",
	});
});

// Start the server
app.listen(PORT, () => {
	// console.log(`Server environment: ${process.env.NODE_ENV || "development"}`);
	// console.log(`Server is running on http://localhost:${PORT}`);
	// console.log("Database URL configured:", !!process.env.DATABASE_URL);
	// console.log("JWT Secret configured:", !!process.env.JWT_SECRET);
});
