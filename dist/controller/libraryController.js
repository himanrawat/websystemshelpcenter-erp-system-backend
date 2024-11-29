"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBookByTeacher = exports.getAllBookByTeacher = exports.getAllBook = exports.createBook = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createBook = async (req, res) => {
    const { file, name, teacherId, subject, campusId } = req.body;
    try {
        const isTeacher = await db_config_1.default.teacher.findUnique({
            where: {
                id: parseInt(teacherId),
            },
            select: {
                name: true,
            }
        });
        if (!isTeacher)
            return res.status(404).json({ message: "Teacher does not exist!", success: false });
        const newPdf = await db_config_1.default.library.create({
            data: {
                file,
                name,
                teacherId: parseInt(teacherId),
                subject,
                teacherName: isTeacher.name,
                campusId: parseInt(campusId)
            },
        });
        return res
            .status(201)
            .json({ message: "Library created successfully!", data: newPdf, success: true });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try after some time.", error: error, success: false });
    }
};
exports.createBook = createBook;
const getAllBook = async (req, res) => {
    const campusId = req.params.campusId;
    try {
        const books = await db_config_1.default.library.findMany({
            where: {
                campusId: parseInt(campusId),
            },
            select: {
                id: true,
                name: true,
                file: true,
                subject: true,
                teacherName: true,
            }
        });
        if (books.length === 0)
            return res.status(200).json({ message: "No book exists in the library", success: false });
        return res
            .status(200)
            .json({ message: "All books fetched successfully!", data: books, success: true });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try after some time.", success: false });
    }
};
exports.getAllBook = getAllBook;
const getAllBookByTeacher = async (req, res) => {
    const teacher_id = parseInt(req.params.teacher_id);
    try {
        const books = await db_config_1.default.library.findMany({
            where: {
                teacherId: teacher_id,
            },
            select: {
                id: true,
                name: true,
                file: true,
                subject: true,
                teacherName: true,
            }
        });
        if (books.length === 0)
            return res.status(200).json({ message: "No book exists in the library", success: false });
        return res
            .status(200)
            .json({ message: "All books fetched successfully!", data: books, success: true });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try after some time.", success: false });
    }
};
exports.getAllBookByTeacher = getAllBookByTeacher;
const deleteBookByTeacher = async (req, res) => {
    const { teacher_id, book_id } = req.params;
    try {
        const book = await db_config_1.default.library.findFirst({
            where: {
                AND: [
                    { id: parseInt(book_id) },
                    { teacherId: parseInt(teacher_id) }
                ]
            }
        });
        if (!book)
            return res.status(200).json({ message: "Book related to given teacher does not exists in the library", success: false });
        await db_config_1.default.library.delete({
            where: {
                id: parseInt(book_id),
            }
        });
        return res
            .status(200)
            .json({ message: "Book deleted successfully!", success: true });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try after some time.", success: false });
    }
};
exports.deleteBookByTeacher = deleteBookByTeacher;
