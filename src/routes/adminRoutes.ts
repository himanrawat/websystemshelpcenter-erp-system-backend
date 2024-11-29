import express, { Router } from "express";
const router: Router = express.Router();
import {
  createAdmin,
  
  updateAdmin,
  fetchAdmins,
  showAdminById,
  deleteAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  verifyEmail,
  logout,
  createSupport,
  createPayment,
  createPaymentbyYear,

} from "../controller/adminController";

import { verifyToken, isResetTokenValid, isOtpValid } from "../middleware/auth";

import { validateUser, validate } from "../middleware/validator";
 
router.post("/reg", validateUser, validate, createAdmin);


router.put("/:id", updateAdmin);
router.get("/", fetchAdmins);
router.get("/:id",verifyToken, showAdminById);
router.delete("/:id", deleteAdmin);
router.post("/login", loginAdmin);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token/:id", isResetTokenValid, resetPassword);
router.post("/verify-email/:id", isOtpValid, verifyEmail);
router.post("/logout", logout);
router.post("/support",createSupport)
router.put("/:dep_id/:year/payment", createPaymentbyYear);
router.post("/:dep_id/payment", createPayment);


export default router;
