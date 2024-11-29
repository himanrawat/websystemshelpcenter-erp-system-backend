"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const timeTableController_1 = require("../controller/timeTableController");
router.post("/upload/:teacher_id", timeTableController_1.createTimeTable);
router.get("/fetch-byDepartment/:dep_id", timeTableController_1.getTimeTableByDepartment);
router.put("/update/:teacher_id", timeTableController_1.updateTimeTable);
router.get("/teacher-schedule/:teacherId/:day", timeTableController_1.getTimeTableByTeacherAndDay);
exports.default = router;
