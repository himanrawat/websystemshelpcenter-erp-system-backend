"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const holidayController_1 = require("../controller/holidayController");
router.get("/fetchByDate/:date/:campusId", holidayController_1.getHolidayOnDate);
router.get("/fetch/:campusId", holidayController_1.getHoliday);
router.post("/create/:teacherId", holidayController_1.createHoliday);
router.put("/update/:teacherId/:holidayId", holidayController_1.updateHoliday);
router.delete("/delete/:teacherId/:holidayId", holidayController_1.deleteHoliday);
exports.default = router;
