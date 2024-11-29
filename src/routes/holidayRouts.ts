import express, { Router } from "express";
const router: Router = express.Router();
import {
  createHoliday,
  getHoliday,
  updateHoliday,
  deleteHoliday,
  getHolidayOnDate,
} from "../controller/holidayController";
router.get("/fetchByDate/:date/:campusId", getHolidayOnDate);
router.get("/fetch/:campusId", getHoliday);
router.post("/create/:teacherId", createHoliday);
router.put("/update/:teacherId/:holidayId", updateHoliday);
router.delete("/delete/:teacherId/:holidayId", deleteHoliday);
export default router;
