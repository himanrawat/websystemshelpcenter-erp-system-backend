"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Importing Routes
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const teacherRoutes_1 = __importDefault(require("./teacherRoutes"));
const studentRoutes_1 = __importDefault(require("./studentRoutes"));
const departmentRoutes_1 = __importDefault(require("./departmentRoutes"));
const subjectRoutes_1 = __importDefault(require("./subjectRoutes"));
const attendanceRoutes_1 = __importDefault(require("./attendanceRoutes"));
const eventRoutes_1 = __importDefault(require("./eventRoutes"));
const libraryRoutes_1 = __importDefault(require("./libraryRoutes"));
const resultRoutes_1 = __importDefault(require("./resultRoutes"));
const leaveRoutes_1 = __importDefault(require("./leaveRoutes"));
const timeTableRoutes_1 = __importDefault(require("./timeTableRoutes"));
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
const supportRoutes_1 = __importDefault(require("./supportRoutes"));
const holidayRouts_1 = __importDefault(require("./holidayRouts"));
const campusRoute_1 = __importDefault(require("./campusRoute"));
const testRoute_1 = __importDefault(require("./testRoute"));
// Using Routes
router.use("/api/v1/campus", campusRoute_1.default);
router.use("/api/v1/admin", adminRoutes_1.default);
router.use("/api/v1/teacher", teacherRoutes_1.default);
router.use("/api/v1/student", studentRoutes_1.default);
router.use("/api/v1/department", departmentRoutes_1.default);
router.use("/api/v1/subject", subjectRoutes_1.default);
router.use("/api/v1/attendance", attendanceRoutes_1.default);
router.use("/api/v1/event", eventRoutes_1.default);
router.use("/api/v1/library", libraryRoutes_1.default);
router.use("/api/v1/results", resultRoutes_1.default);
router.use("/api/v1/leave", leaveRoutes_1.default);
router.use("/api/v1/timeTable", timeTableRoutes_1.default);
router.use("/api/v1/payment", paymentRoutes_1.default);
router.use("/api/v1/support", supportRoutes_1.default);
router.use("/api/v1/holiday", holidayRouts_1.default);
// Add test routes
router.use("/api/v1/test", testRoute_1.default);
exports.default = router;
