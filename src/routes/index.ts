import express, { Router } from "express";
const router: Router = express.Router();
// Importing Routes
import adminRoutes from "./adminRoutes";
import TeacherRoutes from "./teacherRoutes";
import StudentRoutes from "./studentRoutes";
import DepartmentRoutes from "./departmentRoutes";
import SubjectRoutes from "./subjectRoutes";
import AttendanceRoutes from "./attendanceRoutes";
import EventRoutes from "./eventRoutes";
import LibraryRoutes from "./libraryRoutes";
import ResultRoutes from "./resultRoutes";
import LeaveRoutes from "./leaveRoutes";
import TimeTableRoutes from "./timeTableRoutes";
import PaymentRoutes from "./paymentRoutes";
import SupportRoutes from "./supportRoutes";
import HolidayRoutes from "./holidayRouts";
import CampusRoutes from "./campusRoute";

// Using Routes
router.use("/api/v1/campus", CampusRoutes);
router.use("/api/v1/admin", adminRoutes);
router.use("/api/v1/teacher", TeacherRoutes);
router.use("/api/v1/student", StudentRoutes);
router.use("/api/v1/department", DepartmentRoutes);
router.use("/api/v1/subject", SubjectRoutes);
router.use("/api/v1/attendance", AttendanceRoutes);
router.use("/api/v1/event", EventRoutes);
router.use("/api/v1/library", LibraryRoutes);
router.use("/api/v1/results", ResultRoutes);
router.use("/api/v1/leave", LeaveRoutes);
router.use("/api/v1/timeTable", TimeTableRoutes);
router.use("/api/v1/payment", PaymentRoutes);
router.use("/api/v1/support", SupportRoutes);
router.use("/api/v1/holiday", HolidayRoutes);

export default router;
