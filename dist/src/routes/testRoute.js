"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_config_1 = __importDefault(require("../db/db.config"));
const router = (0, express_1.Router)();
// Database connection test route
router.get("/db-test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Test the database connection with a query
        const admins = yield db_config_1.default.admin.findMany({
            select: { id: true, name: true, email: true },
        });
        res.status(200).json({
            success: true,
            message: "Successfully connected to the database!",
            data: admins,
        });
    }
    catch (error) {
        // Cast error to Error to safely access its message
        const err = error;
        console.error("Database connection test error:", err.message);
        res.status(500).json({
            success: false,
            message: "Failed to connect to the database.",
            error: err.message,
        });
    }
}));
exports.default = router;
