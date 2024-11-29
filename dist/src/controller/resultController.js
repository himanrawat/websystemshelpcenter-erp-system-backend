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
exports.deleteResults = exports.deleteResultPartial = exports.getAllResults = exports.getResultById = exports.updateFullResult = exports.updateResultPartial = exports.createResults = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const validateResult_1 = require("../middleware/validateResult");
const createResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const results = req.body;
    for (const result of results) {
        const validationError = (0, validateResult_1.validateResultData)(result);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
    }
    try {
        const newResults = [];
        for (const result of results) {
            const existingResult = yield db_config_1.default.marks.findFirst({
                where: {
                    studentId: result.studentId,
                    subjectId: result.subjectId
                }
            });
            if (existingResult) {
                return res.status(400).json({ message: `Result already exists for studentId ${result.studentId} and subjectId ${result.subjectId}` });
            }
            const newResult = yield db_config_1.default.marks.create({
                data: {
                    totalMarks: result.totalMarks,
                    scoredMarks: result.scoredMarks,
                    grade: result.grade,
                    subjectId: result.subjectId,
                    studentId: result.studentId,
                    feedback: String(result.feedback),
                },
            });
            newResults.push(newResult);
        }
        return res.status(201).json({ data: newResults, message: "Results created successfully." });
    }
    catch (error) {
        console.error("Error creating results:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.createResults = createResults;
const updateResultPartial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = Number(req.params.studentId);
    const subjectId = Number(req.params.subjectId);
    const { totalMarks, scoredMarks, grade, feedback } = req.body;
    const validationError = (0, validateResult_1.validatePartialResultData)(req.body);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }
    try {
        const existingResult = yield db_config_1.default.marks.findFirst({
            where: { studentId, subjectId }
        });
        if (!existingResult) {
            return res.status(404).json({ message: "Result not found for the specified student and subject." });
        }
        const updatedData = {};
        if (totalMarks !== undefined)
            updatedData.totalMarks = totalMarks;
        if (scoredMarks !== undefined)
            updatedData.scoredMarks = scoredMarks;
        if (grade !== undefined)
            updatedData.grade = grade;
        updatedData.feedback = feedback;
        const updatedResult = yield db_config_1.default.marks.update({
            where: { id: existingResult.id },
            data: updatedData,
        });
        return res.status(200).json({ data: updatedResult, message: "Result updated successfully." });
    }
    catch (error) {
        console.error("Error updating result:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateResultPartial = updateResultPartial;
const updateFullResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = Number(req.params.studentId);
    const { totalMarks, scoredMarks, grade, subjectId } = req.body;
    const validationError = (0, validateResult_1.validateResultData)(req.body);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }
    try {
        const existingResult = yield db_config_1.default.marks.findFirst({
            where: { studentId, subjectId }
        });
        if (!existingResult) {
            return res.status(404).json({ message: "Result not found for the specified student and subject." });
        }
        const updatedResult = yield db_config_1.default.marks.update({
            where: { id: existingResult.id },
            data: { totalMarks, scoredMarks, grade },
        });
        return res.status(200).json({ data: updatedResult, message: "Result updated successfully." });
    }
    catch (error) {
        console.error("Error updating result:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateFullResult = updateFullResult;
const getResultById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const studentId = Number(req.params.studentId);
    try {
        const student = yield db_config_1.default.student.findUnique({
            where: { id: studentId },
            include: {
                marks: {
                    include: {
                        subject: true,
                    },
                    orderBy: {
                        subjectId: 'asc'
                    }
                },
                campus: true,
            }
        });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        // Group marks by subject ID and aggregate total marks and scored marks
        const resultsMap = new Map();
        student.marks.forEach(mark => {
            const subject = mark.subject;
            if (subject && typeof subject.id === 'number') {
                const { id, subjectName } = subject;
                const existingResult = resultsMap.get(id);
                if (existingResult) {
                    existingResult.totalMarks += mark.totalMarks;
                    existingResult.scoredMarks += mark.scoredMarks;
                }
                else {
                    resultsMap.set(id, {
                        subjectId: id,
                        subjectName: subjectName !== null && subjectName !== void 0 ? subjectName : "Unknown",
                        totalMarks: mark.totalMarks,
                        scoredMarks: mark.scoredMarks,
                        grade: mark.grade,
                        feedback: mark.feedback,
                    });
                }
            }
        });
        const results = Array.from(resultsMap.values());
        const totalMarks = results.reduce((acc, result) => acc + result.totalMarks, 0);
        const totalScoredMarks = results.reduce((acc, result) => acc + result.scoredMarks, 0);
        const response = {
            student: {
                id: student.id,
                name: student.name,
                fatherName: student.fatherName,
                rollNo: student.rollNo,
                campus: (_b = (_a = student.campus) === null || _a === void 0 ? void 0 : _a.schoolName) !== null && _b !== void 0 ? _b : "Unknown"
            },
            results,
            totalMarks,
            totalScoredMarks
        };
        return res.status(200).json({ data: response });
    }
    catch (error) {
        console.error("Error fetching student results:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getResultById = getResultById;
const getAllResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield db_config_1.default.marks.findMany({
            include: {
                student: {
                    include: {
                        campus: true,
                    },
                },
                subject: true,
            },
        });
        const resultsByStudent = results.reduce((acc, result) => {
            var _a, _b, _c, _d;
            if (result.student) {
                const studentId = result.student.id;
                if (!acc[studentId]) {
                    acc[studentId] = {
                        student: {
                            id: result.student.id,
                            name: result.student.name,
                            fatherName: result.student.fatherName,
                            rollNo: result.student.rollNo,
                            campus: (_b = (_a = result.student.campus) === null || _a === void 0 ? void 0 : _a.schoolName) !== null && _b !== void 0 ? _b : "Unknown"
                        },
                        results: [],
                        totalMarks: 0,
                        totalScoredMarks: 0
                    };
                }
                const existingSubject = acc[studentId].results.find(res => res.subjectId === result.subjectId);
                if (existingSubject) {
                    existingSubject.totalMarks += result.totalMarks;
                    existingSubject.scoredMarks += result.scoredMarks;
                }
                else {
                    acc[studentId].results.push({
                        subjectId: result.subjectId,
                        subjectName: (_d = (_c = result.subject) === null || _c === void 0 ? void 0 : _c.subjectName) !== null && _d !== void 0 ? _d : "Unknown",
                        totalMarks: result.totalMarks,
                        scoredMarks: result.scoredMarks,
                        grade: result.grade
                    });
                }
                acc[studentId].totalMarks += result.totalMarks;
                acc[studentId].totalScoredMarks += result.scoredMarks;
            }
            return acc;
        }, {});
        return res.status(200).json({ data: Object.values(resultsByStudent) });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllResults = getAllResults;
const deleteResultPartial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resultId = Number(req.params.resultId);
    try {
        yield db_config_1.default.marks.delete({
            where: { id: resultId },
        });
        return res.status(200).json({ message: "Result deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting result:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteResultPartial = deleteResultPartial;
const deleteResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = Number(req.params.studentId);
    try {
        yield db_config_1.default.marks.deleteMany({
            where: { studentId },
        });
        return res.status(200).json({ message: "Student results deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting student results:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteResults = deleteResults;
