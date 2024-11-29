import express, { Router } from "express";
const router: Router = express.Router();
import {
    applyLeave,
    changeStatus,
    fetchAllLeaves,
    fetchAllLeavesInCampus
} from "../controller/leaveController";

router.post("/apply-leave", applyLeave);
router.get("/fetch-leaves/:teacher_id", fetchAllLeaves);
router.get("/pending-leaves", fetchAllLeavesInCampus);
router.put("/change-status/:teacherId/:newStatus",changeStatus );
export default router;
