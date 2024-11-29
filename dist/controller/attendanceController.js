"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendenceByDate = exports.getFacultyAttendanceById = exports.updateFacultyAttendance = exports.getFacultyAttendance = exports.markFacultyAttendance = exports.getAttendanceOnADate = exports.getPercentage = exports.updateAttendance = exports.markAttendance = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const date_fns_1 = require("date-fns");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const markAttendance = async (req, res) => {
    // const adminId=req.params.campusId
    const { subjectId, selectedStudents } = req.body;
    try {
        const isSubject = await db_config_1.default.subject.findUnique({
            where: {
                id: parseInt(subjectId),
            },
        });
        if (!isSubject)
            return res
                .status(404)
                .json({ message: "subject does not exist!", success: false });
        const currentDate = new Date();
        const formattedDate = (0, date_fns_1.format)(currentDate, "dd-MM-yyyy");
        const attendanceExist = await db_config_1.default.attendance.findFirst({
            where: {
                AND: [
                    {
                        date: formattedDate,
                    },
                    {
                        subjectId: subjectId,
                    },
                ],
            },
        });
        if (attendanceExist)
            return res.status(409).json({
                message: "Attendance for this date is already marked.",
                success: false,
            });
        const students = await db_config_1.default.student.findMany({
            where: {
                departmentId: isSubject.departmentId,
            },
        });
        const attendanceRecords = [];
        for (const student of students) {
            const isPresent = selectedStudents.includes(student.id);
            const attendanceRecord = {
                date: formattedDate,
                status: isPresent ? "Present" : "Absent",
                subjectId,
                studentId: student.id,
            };
            attendanceRecords.push(attendanceRecord);
        }
        const totalLectures = isSubject.totalLectureTaken + 1;
        await db_config_1.default.attendance.createMany({
            data: attendanceRecords,
        });
        await db_config_1.default.subject.update({
            where: {
                id: parseInt(subjectId),
            },
            data: {
                totalLectureTaken: totalLectures,
            },
        });
        res
            .status(200)
            .json({ message: "Attendance marked successfully", success: true });
    }
    catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ error: "Internal server error", success: false });
    }
};
exports.markAttendance = markAttendance;
const updateAttendance = async (req, res) => {
    const { subjectId, selectedStudents, date } = req.body;
    try {
        const isSubject = await db_config_1.default.subject.findUnique({
            where: {
                id: parseInt(subjectId),
            },
        });
        if (!isSubject)
            return res
                .status(404)
                .json({ message: "subject does not exist!", success: false });
        const students = await db_config_1.default.student.findMany({
            where: {
                departmentId: isSubject.departmentId,
            },
        });
        await db_config_1.default.attendance.deleteMany({
            where: {
                AND: [
                    {
                        date: date,
                    },
                    {
                        subjectId: subjectId,
                    },
                ],
            },
        });
        const attendanceRecords = [];
        for (const student of students) {
            const isPresent = selectedStudents.includes(student.id);
            const attendanceRecord = {
                date: date,
                status: isPresent ? "Present" : "Absent",
                subjectId,
                studentId: student.id,
            };
            attendanceRecords.push(attendanceRecord);
        }
        await db_config_1.default.attendance.createMany({
            data: attendanceRecords,
        });
        res
            .status(202)
            .json({ message: "Attendance updated successfully", success: true });
    }
    catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ error: "Internal server error", success: false });
    }
};
exports.updateAttendance = updateAttendance;
const getPercentage = async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await db_config_1.default.student.findUnique({
            where: {
                id: parseInt(studentId),
            },
            select: {
                departmentId: true,
                attendance: true,
            },
        });
        if (!student) {
            return res.status(404).json({ message: "Student not found", success: false });
        }
        const attendanceRecords = student.attendance;
        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({
                message: "No attendance records found for this subject on this date!",
                success: false,
            });
        }
        const subjects = await db_config_1.default.subject.findMany({
            where: {
                departmentId: student.departmentId,
            },
            select: {
                id: true,
                subjectName: true,
            },
        });
        if (!subjects || subjects.length === 0) {
            return res.status(404).json({
                message: "No subjects found for this department",
                success: false,
            });
        }
        const attendancePercentages = subjects.map(subject => {
            let present = 0;
            let absent = 0;
            for (const attendance of attendanceRecords) {
                if (attendance.subjectId === subject.id) {
                    if (attendance.status === "Present") {
                        present++;
                    }
                    else {
                        absent++;
                    }
                }
            }
            const totalLectures = present + absent;
            const percentage = totalLectures === 0 ? 0 : (present * 100) / totalLectures;
            return {
                subjectId: subject.id,
                subject: subject.subjectName,
                percentage,
            };
        });
        return res.status(200).json({
            message: "Attendance of the percentages fetched successfully!",
            data: attendancePercentages,
            success: true,
        });
    }
    catch (error) {
        console.error("Error fetching attendance percentages:", error);
        return res
            .status(500)
            .json({ error: "Internal server error", success: false });
    }
};
exports.getPercentage = getPercentage;
const getAttendanceOnADate = async (req, res) => {
    const { date, subjectId } = req.params;
    try {
        // const formattedDate = format(date, "dd-MM-yyyy");
        const subject = await db_config_1.default.subject.findUnique({
            where: {
                id: parseInt(subjectId),
            },
        });
        if (!subject) {
            return res
                .status(404)
                .json({ message: "subject not found", success: false });
        }
        const presentStudents = await db_config_1.default.attendance.findMany({
            where: {
                AND: [
                    { date: date },
                    { subjectId: parseInt(subjectId) },
                ]
            }
        });
        if (!presentStudents || presentStudents.length === 0) {
            return res.status(404).json({
                message: "No attendance records found for this subject on this date!",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Attendance of the students fetched successfully!",
            success: true,
            subject: subject.subjectName,
            date: date,
            data: presentStudents,
        });
    }
    catch (error) {
        console.error("Error fetching attendance on a particular date and in a particular subject:", error);
        return res
            .status(500)
            .json({ error: "Internal server error", success: false });
    }
};
exports.getAttendanceOnADate = getAttendanceOnADate;
const markFacultyAttendance = async (req, res) => {
    const adminId = req.params.campusId;
    const { date, selectedTeachers } = req.body;
    try {
        const formattedDate = new Date(date);
        const isAttendanceExist = await db_config_1.default.facultyAttendance.findUnique({
            where: {
                date: formattedDate,
            },
        });
        if (isAttendanceExist)
            return res
                .status(409)
                .json({
                success: false,
                message: "Attendance is already marked for this date!",
            });
        await db_config_1.default.facultyAttendance.create({
            data: {
                adminId: parseInt(adminId),
                date: formattedDate,
                presentTeachers: selectedTeachers,
            },
        });
        return res
            .status(200)
            .json({ message: "attendance marked!", success: true });
    }
    catch (error) {
        console.log(error);
        return res.json(500).json({ message: "something went wrong!" });
    }
};
exports.markFacultyAttendance = markFacultyAttendance;
const getFacultyAttendance = async (req, res) => {
    try {
        const { onDate, campusId } = req.params;
        const date = onDate ? new Date(onDate) : new Date();
        const attendanceOfFaculty = await db_config_1.default.facultyAttendance.findMany({
            where: {
                date: date,
                adminId: parseInt(campusId)
            },
            select: {
                presentTeachers: true,
            },
        });
        if (attendanceOfFaculty.length === 0)
            return res
                .status(404)
                .json({
                message: "No attendance exists for selected date!",
                success: false,
            });
        const presentTeachers = attendanceOfFaculty[0].presentTeachers;
        const teachers = await db_config_1.default.teacher.findMany({
            select: {
                id: true,
                name: true,
            },
        });
        const attendanceStatus = teachers.map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
            status: presentTeachers.includes(teacher.id) ? "Present" : "Absent",
        }));
        return res
            .status(200)
            .json({
            message: "Attendance fetched successfully!",
            success: true,
            attendanceStatus,
            date: date,
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({
            message: "Something went wrong, try after sometime!",
            success: false,
        });
    }
};
exports.getFacultyAttendance = getFacultyAttendance;
const updateFacultyAttendance = async (req, res) => {
    const adminId = req.params.campusId;
    const { date, selectedTeachers } = req.body;
    try {
        const formattedDate = new Date(date).toISOString(); // Ensure date is in ISO-8601 format
        const isAttendanceExist = await db_config_1.default.facultyAttendance.findUnique({
            where: {
                date: formattedDate,
                adminId: parseInt(adminId),
            },
        });
        if (!isAttendanceExist) {
            return res.status(409).json({
                success: false,
                message: "Attendance was not marked on this date!",
            });
        }
        await db_config_1.default.facultyAttendance.update({
            where: {
                date: formattedDate,
                adminId: parseInt(adminId),
            },
            data: {
                presentTeachers: selectedTeachers,
            },
        });
        return res.status(200).json({ message: "Attendance updated successfully!", success: true });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong!", success: false });
    }
};
exports.updateFacultyAttendance = updateFacultyAttendance;
const getFacultyAttendanceById = async (req, res) => {
    const adminId = req.params.campusId;
    const { date, id } = req.params;
    try {
        const formattedDate = new Date(date);
        const attendanceOfFaculty = await db_config_1.default.facultyAttendance.findMany({
            where: {
                date: formattedDate,
                adminId: parseInt(adminId)
            },
            select: {
                presentTeachers: true,
            },
        });
        if (attendanceOfFaculty.length === 0)
            return res.status(404).json({
                message: "No attendance exists for selected date!",
                success: false,
            });
        const presentTeachers = attendanceOfFaculty[0].presentTeachers;
        const isPresent = presentTeachers.includes(parseInt(id));
        return res
            .status(200)
            .json({
            success: true,
            message: "Fetched successfully",
            date: date,
            status: isPresent ? "Present" : "Absent",
        });
    }
    catch (error) {
        console.log(error);
        return res.json(500).json({ message: "something went wrong!", success: false });
    }
};
exports.getFacultyAttendanceById = getFacultyAttendanceById;
const getAttendenceByDate = async (req, res) => {
    const adminId = req.params.campusid;
    const { startDate, endDate } = req.body;
    try {
        const campusId = db_config_1.default.admin.findFirst({
            where: {
                id: parseInt(adminId)
            }
        });
        if (!campusId) {
            return res.status(404).json({
                message: "Campus id not found",
                success: false
            });
        }
        const attendanceRecord = await db_config_1.default.facultyAttendance.findFirst({
            where: {
                adminId: parseInt(adminId),
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                presentTeachers: true
            }
        });
        return res.status(200).json({
            message: "Attendance fetched successfully",
            success: true,
            data: attendanceRecord
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    }
};
exports.getAttendenceByDate = getAttendenceByDate;
