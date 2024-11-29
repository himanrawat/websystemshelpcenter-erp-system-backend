"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStudent = exports.isTeacher = exports.isAdmin = exports.isOtpValid = exports.isResetTokenValid = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const db_config_1 = __importDefault(require("../db/db.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized user!" });
    }
    console.log(process.env.JWT_SECRET);
    try {
        const decoded = jsonwebtoken_1.default.verify(String(token), process.env.JWT_SECRET);
        console.log(decoded);
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Something went wrong!" });
    }
};
exports.verifyToken = verifyToken;
const isResetTokenValid = async (req, res, next) => {
    const { token, id } = req.params;
    if (!token || !id) {
        return res.json({ status: 400, message: "Invalid request!" });
    }
    const user = await db_config_1.default.admin.findFirst({
        where: {
            id: parseInt(id),
        },
    });
    if (!user) {
        return res.json({ status: 400, message: "User Not Found" });
    }
    try {
        const resToken = await db_config_1.default.resetToken.findFirst({
            where: {
                ownerId: parseInt(id),
            },
        });
        if (!resToken) {
            return res.json({ status: 400, message: "Invalid request!" });
        }
        if (resToken && resToken?.expiresAt < new Date()) {
            await db_config_1.default.resetToken.delete({
                where: {
                    ownerId: user.id,
                },
            });
            return res.json({ status: 400, message: "Time out please try again!" });
        }
        // const isValid = compareSync(resToken.token, token);
        if (resToken.token !== token) {
            return res.json({ status: 400, message: "Token not valid!" });
        }
        next();
    }
    catch (error) {
        console.error(error);
        return res.json({ status: 400, message: "Internal server error!" });
    }
};
exports.isResetTokenValid = isResetTokenValid;
const isOtpValid = async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.json({ status: 400, message: "Invalid request!" });
    }
    const user = await db_config_1.default.admin.findFirst({
        where: {
            id: parseInt(id),
        },
    });
    if (!user) {
        return res.json({ status: 400, message: "User Not Found" });
    }
    try {
        const otp_token = await db_config_1.default.otpToken.findFirst({
            where: {
                email: user.email,
            },
        });
        if (!otp_token) {
            return res.json({ status: 400, message: "Invalid request!" });
        }
        if (otp_token && otp_token?.expiresAt < new Date()) {
            await db_config_1.default.otpToken.delete({
                where: {
                    email: user.email,
                },
            });
            return res.json({ status: 400, message: "Time out please try again!" });
        }
        next();
    }
    catch (error) {
        console.error(error);
        return res.json({ status: 400, message: "Internal server error!" });
    }
};
exports.isOtpValid = isOtpValid;
const isAdmin = async (req, res, next) => {
    try {
        const authorizationToken = req.headers.authorization;
        const token = authorizationToken?.split("Bearer ")[1];
        if (!token)
            return res.status(403).json({ error: "unauthorized access!" });
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await db_config_1.default.admin.findUnique({
            where: {
                id: payload.id,
            },
        });
        if (!user)
            return res.status(403).json({ success: false, message: "unauthorized access!" });
        if (!(user.role === "admin"))
            res.status(403).json({ success: false, message: "You doesn't have access to admin page." });
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.status(403).json({ success: false, message: "unauthorized access!" });
        }
        else {
            res.status(500).json({ success: false, message: "Something went wrong!" });
        }
    }
};
exports.isAdmin = isAdmin;
const isTeacher = async (req, res, next) => {
    try {
        const authorizationToken = req.headers.authorization;
        const token = authorizationToken?.split("Bearer ")[1];
        if (!token)
            return res.status(403).json({ error: "unauthorized access!" });
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await db_config_1.default.teacher.findUnique({
            where: {
                id: payload.id,
            },
        });
        if (!user)
            return res.status(403).json({ success: false, message: "unauthorized access!" });
        if (!(user.role === "teacher"))
            res.status(403).json({ success: false, message: "You doesn't have access to teacher's page." });
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.status(403).json({ success: false, message: "unauthorized access!" });
        }
        else {
            res.status(500).json({ success: false, message: "Something went wrong!" });
        }
    }
};
exports.isTeacher = isTeacher;
const isStudent = async (req, res, next) => {
    try {
        const authorizationToken = req.headers.authorization;
        const token = authorizationToken?.split("Bearer ")[1];
        if (!token)
            return res.status(403).json({ error: "unauthorized access!" });
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await db_config_1.default.student.findUnique({
            where: {
                id: payload.id,
            },
        });
        if (!user)
            return res.status(403).json({ success: false, message: "unauthorized access!" });
        if (!(user.role === "student"))
            res.status(403).json({ success: false, message: "You doesn't have access to student's page." });
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.status(403).json({ success: false, message: "unauthorized access!" });
        }
        else {
            res.status(500).json({ success: false, message: "Something went wrong!" });
        }
    }
};
exports.isStudent = isStudent;
