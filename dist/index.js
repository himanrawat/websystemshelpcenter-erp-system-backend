"use strict";
// import dotenv from "dotenv";
// dotenv.config();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Update port configuration to use Azure's environment variable
const PORT = parseInt(process.env.PORT || "8080");
app.get("/", (req, res) => {
    console.log("Root endpoint hit"); // Add logging
    return res.send({ message: "API Working with /api/v1" });
});
// Add CORS configuration for your Vercel frontend
app.use((0, cors_1.default)({
    origin: ["https://campus-erp-admin.vercel.app", "http://localhost:3000"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
// Add error handling
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal Server Error", success: false });
});
app.use(index_1.default);
// Add startup logging
app.listen(PORT, () => {
    console.log(`Server environment: ${process.env.NODE_ENV}`);
    console.log(`Server is running on port ${PORT}`);
    console.log("Database URL configured:", !!process.env.DATABASE_URL);
    console.log("JWT Secret configured:", !!process.env.JWT_SECRET);
});
