import { Router } from "express";
import { createSupport,updateSupport, getSupportRequestByfilter } from "../controller/supportTeamController";

const router = Router();

// router.post("/create", createSupportRequest);
// router.get("/", getSupportRequest);
// router.put("/:id", updateSupportRequest);
// router.get("/",getAllSupportRequests);
router.post("/create",createSupport);
router.get("/filter",getSupportRequestByfilter);
router.put("/update/:complaintNo",updateSupport);
// router.post("/admin/support",createSupport)

export default router;