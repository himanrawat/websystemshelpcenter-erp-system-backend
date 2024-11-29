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
dotenv.config();

import express, { Request, Response } from "express";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Update port configuration to use Azure's environment variable
const PORT: number = parseInt(process.env.PORT || "8080");

app.get("/", (req: Request, res: Response) => {
	console.log("Root endpoint hit"); // Add logging
	return res.send({ message: "API Working with /api/v1" });
});

// Add CORS configuration for your Vercel frontend
app.use(
	cors({
		origin: ["https://campus-erp-admin.vercel.app", "http://localhost:3000"],
		credentials: true,
	})
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Add error handling
app.use((err: any, req: Request, res: Response, next: any) => {
	console.error("Error:", err);
	res.status(500).json({ message: "Internal Server Error", success: false });
});

app.use(routes);

// Add startup logging
app.listen(PORT, () => {
	console.log(`Server environment: ${process.env.NODE_ENV}`);
	console.log(`Server is running on port ${PORT}`);
	console.log("Database URL configured:", !!process.env.DATABASE_URL);
	console.log("JWT Secret configured:", !!process.env.JWT_SECRET);
});
