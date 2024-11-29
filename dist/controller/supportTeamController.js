"use strict";
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
const createSupport = async (req, res) => {
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
        await prisma.$transaction(async (prisma) => {
            await transporter.sendMail(message);
            const newQuery = await prisma.support.create({
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
            const queryData = {
                ...newQuery,
                contactNo: newQuery.contactNo.toString(),
            };
            res.status(200).json({
                success: true,
                message: "Your query has been sent successfully!",
                queryData,
            });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating support ticket or sending email" });
    }
};
exports.createSupport = createSupport;
const updateSupport = async (req, res) => {
    const id = req.params.complaintNo;
    const { status, reply } = req.body;
    try {
        const updatedSupport = await prisma.support.update({
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
};
exports.updateSupport = updateSupport;
const getSupportRequestByfilter = async (req, res) => {
    try {
        if (req.query.type && req.query.status && req.query.department) {
            const type = req.query.type;
            const status = req.query.status;
            const department = req.query.department;
            const supportRequests = await prisma.support.findMany({
                where: {
                    type: String(type),
                    status: String(status),
                    department: String(department)
                }
            });
            const result = supportRequests.map((supportRequest) => {
                return {
                    ...supportRequest,
                    contactNo: supportRequest.contactNo.toString()
                };
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                result
            });
        }
        else if (req.query.type && req.query.status) {
            const type = req.query.type;
            const status = req.query.status;
            const supportRequest = await prisma.support.findMany({
                where: {
                    type: String(type),
                    status: String(status)
                }
            });
            const result = supportRequest.map((supportRequest) => {
                return {
                    ...supportRequest,
                    contactNo: supportRequest.contactNo.toString()
                };
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                result
            });
        }
        else if (req.query.type && req.query.department) {
            const type = req.query.type;
            const department = req.query.department;
            const supportRequest = await prisma.support.findMany({
                where: {
                    type: String(type),
                    department: String(department)
                }
            });
            const result = supportRequest.map((supportRequest) => {
                return {
                    ...supportRequest,
                    contactNo: supportRequest.contactNo.toString()
                };
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                result
            });
        }
        else if (req.query.status && req.query.department) {
            const status = req.query.status;
            const department = req.query.department;
            const supportRequest = await prisma.support.findMany({
                where: {
                    status: String(status),
                    department: String(department)
                }
            });
            const result = supportRequest.map((supportRequest) => {
                return {
                    ...supportRequest,
                    contactNo: supportRequest.contactNo.toString()
                };
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                result
            });
        }
        else if (req.query.type) {
            const type = req.query.type;
            const supportRequest = await prisma.support.findMany({
                where: {
                    type: String(type)
                }
            });
            const result = supportRequest.map((supportRequest) => {
                return {
                    ...supportRequest,
                    contactNo: supportRequest.contactNo.toString()
                };
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                result
            });
        }
        else if (req.query.status) {
            const status = req.query.status;
            const supportRequest = await prisma.support.findMany({
                where: {
                    status: String(status)
                }
            });
            const result = supportRequest.map((supportRequest) => {
                return {
                    ...supportRequest,
                    contactNo: supportRequest.contactNo.toString()
                };
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                result
            });
        }
        else if (req.query.department) {
            const department = req.query.department;
            const supportRequest = await prisma.support.findMany({
                where: {
                    department: String(department)
                }
            });
            const result = supportRequest.map((supportRequest) => {
                return {
                    ...supportRequest,
                    contactNo: supportRequest.contactNo.toString()
                };
            });
            res.status(200).json({
                message: "Support Requests fetched successfully",
                result
            });
        }
        else {
            const supportRequests = await prisma.support.findMany();
            const supportRequestsWithContactNo = supportRequests.map((supportRequest) => {
                return {
                    ...supportRequest,
                    contactNo: supportRequest.contactNo.toString()
                };
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
};
exports.getSupportRequestByfilter = getSupportRequestByfilter;
// status
