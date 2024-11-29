"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHoliday = exports.updateHoliday = exports.getHolidayOnDate = exports.getHoliday = exports.createHoliday = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const createHoliday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherId = parseInt(req.params.teacherId);
    let { date, reason, campusId } = req.body;
    try {
        date = new Date(date);
        const isTeacher = yield db_config_1.default.teacher.findUnique({
            where: {
                id: teacherId,
            },
            select: {
                AdditionalRole: true,
            },
        });
        if (!isTeacher || isTeacher.AdditionalRole !== "class teacher") {
            return res.status(400).json({
                message: "You are not allowed to mark the holiday!",
                success: false,
            });
        }
        const isHoliday = yield db_config_1.default.holiday.findUnique({
            where: {
                date: date,
            },
        });
        if (isHoliday)
            return res
                .status(409)
                .json({
                success: false,
                message: "Holiday for this date is already marked!",
            });
        const holiday = yield db_config_1.default.holiday.create({
            data: {
                date: new Date(date),
                reason,
                teacherId,
                campusId
            },
        });
        res.status(201).json({ success: true, message: "", holiday });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createHoliday = createHoliday;
const getHoliday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const campusId = parseInt(req.params.campusId);
    try {
        const holidays = yield db_config_1.default.holiday.findMany({
            orderBy: {
                date: "asc",
            },
            where: {
                campusId: campusId
            }
        });
        const holidaysByMonth = holidays.reduce((acc, holiday) => {
            const month = holiday.date.getMonth(); // getMonth() is zero-indexed
            const monthName = monthNames[month];
            const formattedHoliday = {
                id: holiday.id,
                date: holiday.date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }),
                reason: holiday.reason,
                teacherId: holiday.teacherId
            };
            if (!acc[monthName]) {
                acc[monthName] = [];
            }
            acc[monthName].push(formattedHoliday);
            return acc;
        }, {});
        res.status(200).json(holidaysByMonth);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getHoliday = getHoliday;
const getHolidayOnDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const givenDate = req.params.date;
    const campusId = parseInt(req.params.campusId);
    try {
        const date = new Date(givenDate);
        const holiday = yield db_config_1.default.holiday.findUnique({
            where: {
                date: date,
                campusId: campusId
            }
        });
        if (!holiday)
            return res.status(200).json({ success: true, message: "No holiday on this date" });
        res.status(200).json({ success: true, message: "It's a holiday on given date!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getHolidayOnDate = getHolidayOnDate;
const updateHoliday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherId = parseInt(req.params.teacherId);
    const holiday_id = parseInt(req.params.holidayId);
    let { date, reason } = req.body;
    try {
        if (date)
            date = new Date(date);
        const isTeacher = yield db_config_1.default.teacher.findUnique({
            where: {
                id: teacherId,
            },
            select: {
                AdditionalRole: true,
            },
        });
        if (!isTeacher || isTeacher.AdditionalRole !== "class teacher") {
            return res.status(400).json({
                message: "You are not allowed to modify the holiday!",
                success: false,
            });
        }
        const isHoliday = yield db_config_1.default.holiday.findUnique({
            where: {
                id: holiday_id
            },
        });
        if (!isHoliday)
            return res
                .status(404)
                .json({
                success: false,
                message: "Holiday for this date is not present!",
            });
        const holiday = yield db_config_1.default.holiday.update({
            where: {
                id: holiday_id
            },
            data: {
                date: date || isHoliday.date,
                reason,
                teacherId,
            },
        });
        res
            .status(200)
            .json({ success: true, message: "update successfully!", holiday });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateHoliday = updateHoliday;
const deleteHoliday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherId = parseInt(req.params.teacherId);
    const holiday_id = parseInt(req.params.holidayId);
    try {
        const isHoliday = yield db_config_1.default.holiday.findUnique({
            where: {
                id: holiday_id,
            },
        });
        if (!isHoliday)
            return res
                .status(404)
                .json({
                success: false,
                message: "holiday is not present for this date!",
            });
        const isTeacher = yield db_config_1.default.teacher.findUnique({
            where: {
                id: teacherId,
            },
            select: {
                AdditionalRole: true,
            },
        });
        if (!isTeacher || isTeacher.AdditionalRole !== "class teacher") {
            return res.status(401).json({
                message: "You are not allowed to delete the holiday!",
                success: false,
            });
        }
        yield db_config_1.default.holiday.delete({
            where: {
                id: holiday_id,
            },
        });
        res.status(200).json({ success: true, message: "deleted successfully!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteHoliday = deleteHoliday;
