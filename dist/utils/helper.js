"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_id = exports.sendOtp = exports.generateOtp = exports.generateRandomToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const db_config_1 = __importDefault(require("../db/db.config"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = require("bcrypt");
const date_fns_1 = require("date-fns");
const mail_1 = require("./mail");
const generateRandomToken = (length) => {
    return crypto_1.default.randomBytes(length).toString('hex');
};
exports.generateRandomToken = generateRandomToken;
const generateOtp = () => {
    return new Promise((resolve) => {
        let otp = "";
        for (let i = 0; i < 4; i++) {
            const randVal = Math.round(Math.random() * 9);
            otp = otp + randVal;
        }
        resolve(otp);
    });
};
exports.generateOtp = generateOtp;
let config = {
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
};
const sendOtp = async (email) => {
    try {
        const otpToken = await db_config_1.default.otpToken.findFirst({
            where: { email: email },
        });
        if (otpToken && otpToken.expiresAt > new Date()) {
            return { success: false, message: 'OTP has already been sent to you!' };
        }
        if (otpToken && otpToken.expiresAt < new Date()) {
            await db_config_1.default.otpToken.delete({
                where: { email: email },
            });
        }
        const OTP = await (0, exports.generateOtp)();
        const hashedOtp = (0, bcrypt_1.hashSync)(OTP, 10);
        const expiresAt = (0, date_fns_1.addMinutes)(new Date(), 10);
        await db_config_1.default.otpToken.create({
            data: {
                email: email,
                token: hashedOtp,
                expiresAt: expiresAt,
            },
        });
        const transporter = nodemailer_1.default.createTransport(config);
        const message = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Verification Email',
            html: (0, mail_1.generateEmailTemplate)(OTP),
        };
        await transporter.sendMail(message);
        return { success: true, message: 'Verification email has been sent.' };
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        return { success: false, message: 'Error in sending email.' };
    }
};
exports.sendOtp = sendOtp;
const generate_id = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    let id = '';
    for (let i = 0; i < 3; i++) {
        id += letters[Math.floor(Math.random() * letters.length)];
    }
    for (let i = 0; i < 4; i++) {
        id += digits[Math.floor(Math.random() * digits.length)];
    }
    id = id.split('').sort(() => Math.random() - 0.5).join('');
    return id;
};
exports.generate_id = generate_id;
