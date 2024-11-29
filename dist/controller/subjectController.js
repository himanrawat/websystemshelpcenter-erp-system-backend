"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubject = exports.getAllSubject = exports.updateSubject = exports.getSubject = exports.createSubject = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createSubject = async (req, res) => {
    const { subjectName, subjectCode, totalLectures, teacherId } = req.body;
    const dep_id = req.params.depId;
    try {
        const findDepartment = await db_config_1.default.department.findUnique({
            where: {
                id: parseInt(dep_id),
            },
        });
        if (!findDepartment)
            return res.status(404).json({ message: "Department does not exist!" });
        const findSubject = await db_config_1.default.subject.findFirst({
            where: {
                OR: [
                    {
                        subjectCode: subjectCode,
                    },
                    {
                        subjectName: subjectName,
                    },
                ],
            },
        });
        if (findSubject?.departmentId === findDepartment.id) {
            return res.status(409).json({ message: "Subject already exists!" });
        }
        const newSubject = await db_config_1.default.subject.create({
            data: {
                subjectName,
                subjectCode,
                // totalLectures,
                departmentId: parseInt(dep_id),
                teacherId,
            },
        });
        return res
            .status(201)
            .json({ message: "New Subject is created!", data: newSubject });
    }
    catch (error) {
        console.error("Error in creating subject:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createSubject = createSubject;
//when we will assign a teacher to a subject we will call update subject to include teacher value in the subject model.
const getSubject = async (req, res) => {
    const subject_id = req.params.id;
    try {
        const subjectExist = await db_config_1.default.subject.findUnique({
            where: {
                id: parseInt(subject_id),
            },
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        gender: true,
                        departmentId: true,
                    },
                },
                attendance: true,
                marks: true,
            },
        });
        if (!subjectExist)
            return res
                .status(404)
                .json({ message: "Subject does not exist!", success: false });
        return res.status(200).json({
            data: subjectExist,
            message: "Subject fetched successfully!",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong.", success: false });
    }
};
exports.getSubject = getSubject;
const updateSubject = async (req, res) => {
    const subId = req.params.subId;
    const { subjectName, subjectCode, totalLectures, teacherId } = req.body;
    try {
        const isSubjectExist = await db_config_1.default.subject.findUnique({
            where: {
                id: parseInt(subId),
            },
            select: {
                departmentId: true,
            }
        });
        if (!isSubjectExist)
            return res
                .status(404)
                .json({ message: "Subject does not exist!", success: false });
        if (teacherId) {
            const isTeacher = await db_config_1.default.teacher.findUnique({
                where: {
                    id: parseInt(teacherId),
                },
                select: {
                    subject: true,
                }
            });
            if (!isTeacher)
                return res.status(404).json({ message: "Teacher doesn't exist!" });
        }
        await db_config_1.default.subject.update({
            where: {
                id: parseInt(subId),
            },
            data: {
                subjectCode,
                subjectName,
                // totalLectures,
                teacherId,
            },
        });
        return res
            .status(200)
            .json({
            message: "Subject details updated successfully!",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!", success: false });
    }
};
exports.updateSubject = updateSubject;
const getAllSubject = async (req, res) => {
    const dep_id = req.params.dep_id;
    try {
        const departmentExist = await db_config_1.default.department.findUnique({
            where: {
                id: parseInt(dep_id),
            },
        });
        if (!departmentExist)
            return res
                .status(404)
                .json({ message: "Department does not exist!", success: false });
        const subjects = await db_config_1.default.subject.findMany({
            where: {
                departmentId: parseInt(dep_id),
            },
        });
        if (subjects.length === 0)
            return res
                .status(200)
                .json({ message: "There are no subjects in this department!" });
        return res.status(200).json({
            data: subjects,
            message: "Subject fetched successfully!",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong.", success: false });
    }
};
exports.getAllSubject = getAllSubject;
const deleteSubject = async (req, res) => {
    const subject_id = req.params.subject_id;
    try {
        const subjectExist = await db_config_1.default.subject.findUnique({
            where: {
                id: parseInt(subject_id),
            },
        });
        if (!subjectExist)
            return res
                .status(404)
                .json({ message: "Subject does not exist!", success: false });
        await db_config_1.default.subject.delete({
            where: {
                id: parseInt(subject_id),
            },
        });
        return res.status(200).json({
            message: "Subject deleted successfully!",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong.", success: false });
    }
};
exports.deleteSubject = deleteSubject;
