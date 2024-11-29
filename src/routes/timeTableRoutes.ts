import express, { Router } from "express";
const router: Router = express.Router();
import {
  createTimeTable,
  getTimeTableByDepartment,
  updateTimeTable,
  getTimeTableByTeacherAndDay
} from "../controller/timeTableController";

router.post("/upload/:teacher_id", createTimeTable);
router.get("/fetch-byDepartment/:dep_id", getTimeTableByDepartment);
router.put("/update/:teacher_id", updateTimeTable);
router.get("/teacher-schedule/:teacherId/:day",getTimeTableByTeacherAndDay)
export default router;
