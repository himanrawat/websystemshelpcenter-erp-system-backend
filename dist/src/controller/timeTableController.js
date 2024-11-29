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
exports.getTimeTableByTeacherAndDay = exports.updateTimeTable = exports.getTimeTableByDepartment = exports.createTimeTable = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createTimeTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentId, monday = [], tuesday = [], wednesday = [], thursday = [], friday = [], saturday = [], } = req.body;
    const teacherId = req.params.teacher_id;
    try {
        const isTeacher = yield db_config_1.default.teacher.findUnique({
            where: {
                id: parseInt(teacherId),
            },
            select: {
                id: true,
                AdditionalRole: true,
            },
        });
        if (!isTeacher || isTeacher.AdditionalRole !== "class teacher") {
            return res
                .status(400)
                .json({
                message: "You are not allowed to add the time table!",
                success: false,
            });
        }
        const isClass = yield db_config_1.default.department.findUnique({
            where: {
                id: parseInt(departmentId),
            },
            select: {
                name: true,
            },
        });
        if (!isClass)
            return res
                .status(404)
                .json({ message: "class does not exist!", success: false });
        const timeTableData = {
            departmentId: parseInt(departmentId),
            departmentName: isClass.name,
            monday: monday || null,
            tuesday: tuesday || null,
            wednesday: wednesday || null,
            thursday: thursday || null,
            friday: friday || null,
            saturday: saturday || null,
        };
        const newTimeTable = yield db_config_1.default.timeTable.create({
            data: timeTableData,
        });
        return res
            .status(201)
            .json({
            message: "time table uploaded successfully!",
            newTimeTable,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({
            message: "Something went wrong! Please try after some time.",
            success: false,
        });
    }
});
exports.createTimeTable = createTimeTable;
const getTimeTableByDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dep_id = parseInt(req.params.dep_id);
    try {
        const isDepartment = yield db_config_1.default.department.findUnique({
            where: {
                id: dep_id,
            },
        });
        if (!isDepartment)
            return res
                .status(404)
                .json({ message: "Department not found!", success: false });
        const timeTable = yield db_config_1.default.timeTable.findMany({
            where: {
                departmentId: dep_id,
            },
            select: {
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: true,
            },
        });
        return res
            .status(200)
            .json({
            message: "Time table fetched successfully!",
            success: true,
            timeTable,
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "something went wrong!", success: false });
    }
});
exports.getTimeTableByDepartment = getTimeTableByDepartment;
const updateTimeTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentId, monday, tuesday, wednesday, thursday, friday, saturday, } = req.body;
    const teacherId = req.params.teacher_id;
    try {
        const isTeacher = yield db_config_1.default.teacher.findUnique({
            where: {
                id: parseInt(teacherId),
            },
            select: {
                AdditionalRole: true,
            },
        });
        if (!isTeacher || isTeacher.AdditionalRole !== "class teacher") {
            return res
                .status(400)
                .json({
                message: "You are not allowed to update the time table!",
                success: false,
            });
        }
        const existingTimeTable = yield db_config_1.default.timeTable.findUnique({
            where: {
                departmentId: parseInt(departmentId),
            },
        });
        if (!existingTimeTable) {
            return res
                .status(404)
                .json({
                message: "Timetable for this class does not exist!",
                success: false,
            });
        }
        const timeTableData = {
            monday: monday !== null && monday !== void 0 ? monday : existingTimeTable.monday,
            tuesday: tuesday !== null && tuesday !== void 0 ? tuesday : existingTimeTable.tuesday,
            wednesday: wednesday !== null && wednesday !== void 0 ? wednesday : existingTimeTable.wednesday,
            thursday: thursday !== null && thursday !== void 0 ? thursday : existingTimeTable.thursday,
            friday: friday !== null && friday !== void 0 ? friday : existingTimeTable.friday,
            saturday: saturday !== null && saturday !== void 0 ? saturday : existingTimeTable.saturday,
        };
        const updatedTimeTable = yield db_config_1.default.timeTable.update({
            where: {
                id: existingTimeTable.id,
            },
            data: timeTableData,
        });
        return res
            .status(201)
            .json({
            message: "time table uploaded successfully!",
            updatedTimeTable,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({
            message: "Something went wrong! Please try after some time.",
            success: false,
        });
    }
});
exports.updateTimeTable = updateTimeTable;
const getTimeTableByTeacherAndDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherId = parseInt(req.params.teacherId);
    const day = req.params.day.toLowerCase();
    try {
        const timetable = yield db_config_1.default.timeTable.findMany({
            where: {
                [day]: {
                    not: null,
                },
            },
            select: {
                [day]: true,
            },
        });
        // console.log(JSON.stringify(timetable, null, 2));
        if (!timetable || timetable.length === 0) {
            return res
                .status(404)
                .json({
                message: "No timetable found for the specified day!",
                success: false,
            });
        }
        const daySchedules = timetable
            .map((entry) => entry[day])
            .flat();
        // console.log(daySchedules)
        const filteredSchedules = daySchedules.filter((schedule) => schedule.teacherId === teacherId);
        if (filteredSchedules.length === 0) {
            return res
                .status(404)
                .json({
                message: "No timetable entries found for the specified teacher and day!",
                success: false,
            });
        }
        return res
            .status(200)
            .json({ timetable: filteredSchedules, success: true });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({
            message: "Something went wrong! Please try again later.",
            success: false,
        });
    }
});
exports.getTimeTableByTeacherAndDay = getTimeTableByTeacherAndDay;
