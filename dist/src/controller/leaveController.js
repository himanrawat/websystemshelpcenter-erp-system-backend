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
exports.fetchAllLeavesInCampus = exports.changeStatus = exports.fetchAllLeaves = exports.applyLeave = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_1 = require("../utils/mail");
let config = {
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
};
const applyLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { dateFrom, dateTo, noOfDays, reason, teacherId } = req.body;
    const applyDate = new Date();
    dateFrom = new Date(dateFrom);
    dateTo = new Date(dateTo);
    try {
        const isTeacher = yield db_config_1.default.teacher.findUnique({
            where: {
                id: teacherId,
            }
        });
        if (!isTeacher)
            return res.status(404).json({ message: "Teacher does not exist", success: false });
        const appliedLeave = yield db_config_1.default.leave.create({
            data: {
                applyDate,
                dateFrom: dateFrom,
                dateTo: dateTo,
                noOfDays,
                reason,
                teacherId,
                name: isTeacher.name,
            }
        });
        return res.status(201).json({ success: true, message: "Leave applied successfully!", data: appliedLeave });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
});
exports.applyLeave = applyLeave;
const fetchAllLeaves = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherId = parseInt(req.params.teacher_id);
    try {
        const isTeacher = yield db_config_1.default.teacher.findUnique({
            where: {
                id: teacherId,
            }
        });
        if (!isTeacher)
            return res.status(404).json({ message: "Teacher does not exist", success: false });
        const leaves = yield db_config_1.default.leave.findMany({
            where: {
                teacherId: teacherId,
            },
            select: {
                applyDate: true,
                dateFrom: true,
                dateTo: true,
                status: true,
                noOfDays: true,
                reason: true,
                name: true,
            }
        });
        if (leaves.length === 0)
            return res.status(200).json({ message: "You have not applied for any leaves!", success: true });
        return res.status(201).json({ success: true, message: "Leaves fetched successfully!", data: leaves });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
});
exports.fetchAllLeaves = fetchAllLeaves;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { teacherId, newStatus } = req.params;
    newStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    try {
        const isTeacher = yield db_config_1.default.teacher.findUnique({
            where: {
                id: parseInt(teacherId),
            }
        });
        if (!isTeacher)
            return res.status(404).json({ message: "Teacher does not exist", success: false });
        const email = isTeacher.email;
        const findLeave = yield db_config_1.default.leave.findFirst({
            where: {
                AND: [
                    {
                        teacherId: parseInt(teacherId),
                    },
                    {
                        status: "pending",
                    },
                ],
            }
        });
        if (!findLeave)
            return res.status(404).json({ message: "For this teacher leave request is not available!", success: false });
        const updatedStatus = newStatus === "Accept" ? "Accepted" : "Rejected";
        const updatedLeave = yield db_config_1.default.leave.update({
            where: {
                id: findLeave.id,
            },
            data: {
                status: updatedStatus,
            }
        });
        let transporter = nodemailer_1.default.createTransport(config);
        let message = {
            from: process.env.EMAIL,
            to: email,
            subject: "Status of your Leave",
            html: (0, mail_1.leaveStatusEmail)(isTeacher.name, findLeave.applyDate, updatedStatus, "For any query regarding this contact to admin!"),
        };
        transporter.sendMail(message, (error) => {
            if (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ error: "Error sending leave status email", success: false });
            }
            else {
                return res.status(200).json({
                    success: true,
                    message: "Email is successfully  sent to teacher.",
                    updatedLeave,
                });
            }
        });
        return res.status(200).json({ message: "Leave status updated successfully!", success: true, updatedLeave });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "something went wrong!", success: false });
    }
});
exports.changeStatus = changeStatus;
const fetchAllLeavesInCampus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaves = yield db_config_1.default.leave.findMany({
            where: {
                status: "pending",
            },
            select: {
                applyDate: true,
                dateFrom: true,
                dateTo: true,
                status: true,
                noOfDays: true,
                reason: true,
                teacherId: true,
                name: true,
            }
        });
        if (leaves.length === 0)
            return res.status(200).json({ message: "No leaves are requested!", success: true });
        return res.status(201).json({ success: true, message: "Leaves fetched successfully!", leaves });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
});
exports.fetchAllLeavesInCampus = fetchAllLeavesInCampus;
