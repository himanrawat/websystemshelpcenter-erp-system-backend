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
exports.getSupportRequestByfilter = exports.updateSupport = exports.createSupport = void 0;
const client_1 = require("@prisma/client");
const helper_1 = require("../utils/helper");
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_1 = require("../utils/mail");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let config = {
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
    secure: true, // added for SSL
    port: 465,
};
const prisma = new client_1.PrismaClient();
const createSupport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, contactNo, year, query, type, errorrole, errorpage, department, photo, campusName } = req.body;
    try {
        let complaintId = (0, helper_1.generate_id)();
        let transporter = nodemailer_1.default.createTransport(config);
        let message = {
            from: process.env.EMAIL,
            to: [process.env.EMAIL, email],
            subject: "Portal support",
            html: (0, mail_1.supportTemplate)(complaintId, name, email, contactNo, query),
        };
        yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            yield transporter.sendMail(message);
            const newQuery = yield prisma.support.create({
                data: {
                    name,
                    email,
                    contactNo: BigInt(contactNo),
                    query,
                    complaintNo: complaintId,
                    type,
                    year,
                    department,
                    photo,
                    errorrole,
                    errorpage,
                    campusName
                },
            });
            const queryData = Object.assign(Object.assign({}, newQuery), { contactNo: newQuery.contactNo.toString() });
            res.status(200).json({
                success: true,
                message: "Your query has been sent successfully!",
                queryData,
            });
        }));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating support ticket or sending email" });
    }
});
exports.createSupport = createSupport;
const updateSupport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.complaintNo;
    const { status, reply } = req.body;
    try {
        const updatedSupport = yield prisma.support.update({
            where: {
                complaintNo: String(id)
            },
            data: {
                status,
                reply
            }
        });
        res.status(200).json({
            message: "Support updated successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateSupport = updateSupport;
const getSupportRequestByfilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.query.type && req.query.status && req.query.department) {
            const type = req.query.type;
            const status = req.query.status;
            const department = req.query.department;
            const supportRequests = yield prisma.support.findMany({
                where: {
                    type: String(type),
                    status: String(status),
                    department: String(department)
                }
            });
            const result = supportRequests.map((supportRequest) => {
                return Object.assign(Object.assign({}, supportRequest), { contactNo: supportRequest.contactNo.toString() });
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                result
            });
        }
        else if (req.query.type && req.query.status) {
            const type = req.query.type;
            const status = req.query.status;
            const supportRequest = yield prisma.support.findMany({
                where: {
                    type: String(type),
                    status: String(status)
                }
            });
            const result = supportRequest.map((supportRequest) => {
                return Object.assign(Object.assign({}, supportRequest), { contactNo: supportRequest.contactNo.toString() });
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                result
            });
        }
        else if (req.query.type && req.query.department) {
            const type = req.query.type;
            const department = req.query.department;
            const supportRequest = yield prisma.support.findMany({
                where: {
                    type: String(type),
                    department: String(department)
                }
            });
            const result = supportRequest.map((supportRequest) => {
                return Object.assign(Object.assign({}, supportRequest), { contactNo: supportRequest.contactNo.toString() });
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                result
            });
        }
        else if (req.query.status && req.query.department) {
            const status = req.query.status;
            const department = req.query.department;
            const supportRequest = yield prisma.support.findMany({
                where: {
                    status: String(status),
                    department: String(department)
                }
            });
            const result = supportRequest.map((supportRequest) => {
                return Object.assign(Object.assign({}, supportRequest), { contactNo: supportRequest.contactNo.toString() });
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                result
            });
        }
        else if (req.query.type) {
            const type = req.query.type;
            const supportRequest = yield prisma.support.findMany({
                where: {
                    type: String(type)
                }
            });
            const result = supportRequest.map((supportRequest) => {
                return Object.assign(Object.assign({}, supportRequest), { contactNo: supportRequest.contactNo.toString() });
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                result
            });
        }
        else if (req.query.status) {
            const status = req.query.status;
            const supportRequest = yield prisma.support.findMany({
                where: {
                    status: String(status)
                }
            });
            const result = supportRequest.map((supportRequest) => {
                return Object.assign(Object.assign({}, supportRequest), { contactNo: supportRequest.contactNo.toString() });
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                result
            });
        }
        else if (req.query.department) {
            const department = req.query.department;
            const supportRequest = yield prisma.support.findMany({
                where: {
                    department: String(department)
                }
            });
            const result = supportRequest.map((supportRequest) => {
                return Object.assign(Object.assign({}, supportRequest), { contactNo: supportRequest.contactNo.toString() });
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                result
            });
        }
        else {
            const supportRequests = yield prisma.support.findMany();
            const supportRequestsWithContactNo = supportRequests.map((supportRequest) => {
                return Object.assign(Object.assign({}, supportRequest), { contactNo: supportRequest.contactNo.toString() });
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                supportRequests: supportRequestsWithContactNo
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getSupportRequestByfilter = getSupportRequestByfilter;
// status
