import express, { Router } from "express";

import { createPaymentdetails, getPaymentDetails, getpayment,createPaymentforStudent } from "../controller/paymentController";

import { isStudent } from "../middleware/auth";

const router: Router = express.Router();

router.put("/student/create/payment/:studentid", createPaymentforStudent);
router.put("/create/:paymentid/:studentid", createPaymentdetails);
// router.post("/paymentstatus/:studentid/:paymentid", getPaymentStatus);
router.get("/status/:paymentid", getPaymentDetails);
router.get("/student/:id",getpayment)

export default router;
