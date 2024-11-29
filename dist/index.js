"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "4000");
// if (cluster.isPrimary) {
//   const numCPUs = os.cpus().length;
//   console.log(`Master ${process.pid} is running`);
//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
// Workers can share any TCP connection
// In this case, it is an HTTP server
app.get("/", (req, res) => {
    return res.send({ message: "API Working with /api/v1" });
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// app.use(cors({ origin: 'https://campus-erp-admin.vercel.app' }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(index_1.default);
app.listen(PORT, () => console.log(`Worker ${process.pid} started server on PORT http://localhost:${PORT}`));
// }
