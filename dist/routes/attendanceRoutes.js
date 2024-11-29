"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const attendanceController_1 = require("../controller/attendanceController");
router.post("/mark/", attendanceController_1.markAttendance);
router.get("/get-percentage/:studentId", attendanceController_1.getPercentage);
router.put("/update-attendance", attendanceController_1.updateAttendance);
router.get("/byDate/:subjectId/:date", attendanceController_1.getAttendanceOnADate);
router.post("/markFacultyAttendance/:campusId", attendanceController_1.markFacultyAttendance);
router.get("/fetchFacultyAttendance/:campusId/:onDate?", attendanceController_1.getFacultyAttendance);
router.put("/updateFacultyAttendance/:campusId", attendanceController_1.updateFacultyAttendance);
router.get("/faculty-attendanceById/:date/:campusId/:id", attendanceController_1.getFacultyAttendanceById);
router.post("/getAttendenceByDate/:campusId", attendanceController_1.getAttendenceByDate);
exports.default = router;
