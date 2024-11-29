import express, { Router } from "express";
const router: Router = express.Router();
import {
  markAttendance,
  getPercentage,
  updateAttendance,
  markFacultyAttendance,
  getFacultyAttendance,
  updateFacultyAttendance,
  getFacultyAttendanceById,
  getAttendanceOnADate,
  getAttendenceByDate
} from "../controller/attendanceController";

router.post("/mark/", markAttendance);

router.get("/get-percentage/:studentId", getPercentage);

router.put("/update-attendance", updateAttendance);

router.get("/byDate/:subjectId/:date",getAttendanceOnADate);

router.post("/markFacultyAttendance/:campusId", markFacultyAttendance);

router.get("/fetchFacultyAttendance/:campusId/:onDate?", getFacultyAttendance);

router.put("/updateFacultyAttendance/:campusId", updateFacultyAttendance);

router.get("/faculty-attendanceById/:date/:campusId/:id",getFacultyAttendanceById)

router.post("/getAttendenceByDate/:campusId",getAttendenceByDate)

export default router;
