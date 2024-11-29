"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controller/paymentController");
const router = express_1.default.Router();
router.put("/student/create/payment/:studentid", paymentController_1.createPaymentforStudent);
router.put("/create/:paymentid/:studentid", paymentController_1.createPaymentdetails);
// router.post("/paymentstatus/:studentid/:paymentid", getPaymentStatus);
router.get("/status/:paymentid", paymentController_1.getPaymentDetails);
router.get("/student/:id", paymentController_1.getpayment);
exports.default = router;
