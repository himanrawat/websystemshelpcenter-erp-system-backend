"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentforStudent = exports.getPaymentDetails = exports.createPaymentdetails = exports.getpayment = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getpayment = async (req, res) => {
    const studentid = req.params.id;
    try {
        const payment = await db_config_1.default.student.findUnique({
            where: {
                id: parseInt(studentid)
            },
            select: {
                name: true,
                email: true,
                rollNo: true,
                payment: true,
            }
        });
        if (!payment) {
            res.status(404).json({
                message: "Student not found"
            });
        }
        else {
            res.status(200).json({ message: "Payment fetched Successfully", data: payment });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
};
exports.getpayment = getpayment;
const createPaymentdetails = async (req, res) => {
    const { studentid, paymentid } = req.params;
    const { amount } = req.body;
    console.log(amount, "amount", studentid, "id", paymentid, "paymentid");
    try {
        const studentdetails = await db_config_1.default.student.findUnique({
            where: {
                id: parseInt(studentid)
            },
            select: {
                name: true,
                email: true,
                contactNumber: true
            }
        });
        if (!studentdetails) {
            return res.status(404).json({ message: "Student not found" });
        }
        const updatepayment = await db_config_1.default.payment.update({
            where: {
                id: parseInt(paymentid)
            },
            data: {
                status: "paid",
            }
        });
        const update = await db_config_1.default.paymentdetails.create({
            data: {
                message: "",
                paymentId: parseInt(paymentid),
                status: "paid",
                amount: parseFloat(amount),
                description: "",
            },
        });
        res.status(200).json({ message: "Payment URL Generated Successfully", data: updatepayment });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
};
exports.createPaymentdetails = createPaymentdetails;
const getPaymentDetails = async (req, res) => {
    const paymentId = parseInt(req.params.paymentid);
    console.log(paymentId, "paymentId");
    try {
        const paymentdetails = await db_config_1.default.payment.findUnique({
            where: {
                id: paymentId // Correct field name used
            },
            select: {
                id: true,
                status: true,
                paymentdetails: true,
            }
        });
        if (!paymentdetails) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.status(200).json({ message: "Payment Details Fetched Successfully", data: paymentdetails });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
    // const worker=new Worker('./src/worker/payment/paymentDetails.ts', { workerData: { paymentId } });
    // worker.on('message', (message) => {
    //   res.status(200).json({ message: "Payment Details Fetched Successfully", data: message });
    // });
    // worker.on('error', (error) => {
    //   res.status(500).json({ message: "Internal Server Error", error: error.message });
    // });
};
exports.getPaymentDetails = getPaymentDetails;
const createPaymentforStudent = async (req, res) => {
    const { studentid } = req.params;
    const { amount, title, description } = req.body;
    try {
        const student = await db_config_1.default.student.findUnique({
            where: {
                id: parseInt(studentid)
            }
        });
        const payment = await db_config_1.default.payment.create({
            data: {
                amount: amount,
                title: title,
                description: description,
                studentId: parseInt(studentid),
                localTransactionId: "",
            }
        });
        res.status(200).json({ message: "Payment Created Successfully", data: payment });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
};
exports.createPaymentforStudent = createPaymentforStudent;
