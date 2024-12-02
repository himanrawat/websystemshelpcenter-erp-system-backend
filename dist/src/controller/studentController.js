"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showAllStudentsByDepartmentandYear = exports.deleteAllStudent = exports.deleteStudent = exports.updateStudent = exports.showAllStudents = exports.getStudent = exports.loginStudent = exports.createStudent = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const bcrypt_1 = require("bcrypt");
const jwt = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, rollNo, email, password, gender, dob, photo, contactNumber, departmentId, year, permanent_address, currentAddress, fatherName, motherName, fatherContactNumber, } = req.body;
    const campus_id = req.params.campusId;
    try {
        const findDepartment = yield db_config_1.default.department.findFirst({
            where: {
                id: parseInt(departmentId),
            },
        });
        if (!findDepartment)
            return res
                .status(404)
                .json({ message: "That Department does not exist!", success: false });
        const hashedPassword = (0, bcrypt_1.hashSync)(password, 10);
        const findCampus = yield db_config_1.default.admin.findFirst({
            where: {
                id: parseInt(campus_id),
            },
        });
        if (!findCampus)
            return res
                .status(404)
                .json({ message: "Campus admin does not exist!", success: false });
        const findStudent = yield db_config_1.default.student.findFirst({
            where: {
                OR: [
                    { email: email },
                    { AND: [
                            { departmentId: parseInt(departmentId) },
                            { OR: [{ email: email }, { rollNo }] },
                        ] }
                ]
            },
        });
        if (findStudent) {
            if (findStudent.email === email) {
                return res
                    .status(409)
                    .json({
                    message: "Student's email already exists!",
                    success: false,
                });
            }
            if (findStudent.departmentId === parseInt(departmentId) &&
                findStudent.rollNo === rollNo) {
                return res.status(409).json({
                    message: "Student's roll number already exists in this department!",
                    success: false,
                });
            }
        }
        const newStudent = yield db_config_1.default.student.create({
            data: {
                name,
                rollNo,
                email,
                password: hashedPassword,
                gender,
                dob,
                photo,
                contactNumber: BigInt(contactNumber),
                departmentId: parseInt(departmentId),
                year: parseInt(year),
                permanent_address,
                currentAddress,
                campusId: parseInt(campus_id),
                fatherName,
                motherName,
                fatherContactNumber: BigInt(fatherContactNumber),
            },
        });
        const { password: _, created_at, updated_at } = newStudent, responseData = __rest(newStudent, ["password", "created_at", "updated_at"]);
        const studentData = Object.assign(Object.assign({}, responseData), { contactNumber: responseData.contactNumber.toString(), fatherContactNumber: responseData.fatherContactNumber.toString() });
        return res
            .status(201)
            .json({ message: "Student created!", data: studentData, success: true });
    }
    catch (error) {
        console.error("Error creating student:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.createStudent = createStudent;
const loginStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        let student = yield db_config_1.default.student.findUnique({
            where: {
                email: email,
            },
        });
        if (!student) {
            return res.status(400).json({
                message: "Email does not exist, please sign up first!",
                success: false,
            });
        }
        if (!(0, bcrypt_1.compareSync)(password, student.password)) {
            return res
                .status(400)
                .json({ message: "incorrect email or password!", success: false });
        }
        const token = jwt.sign({
            id: student.id,
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
        return res.status(200).json({
            message: "Login successfully!",
            token: token,
            success: true,
            data: {
                id: student.id,
                name: student.name,
                role: student.role,
                photo: student.photo,
                email: student.email,
                school: student.departmentId,
                gender: student.gender,
                campusId: student.campusId,
            },
        });
    }
    catch (error) {
        console.error("Error in logging the student:", error);
        return res.status(500).json({
            message: "Something went wrong. Try after sometime!",
            success: false,
        });
    }
});
exports.loginStudent = loginStudent;
const getStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const student_id = req.params.id;
    try {
        const studentExist = yield db_config_1.default.student.findFirst({
            where: {
                id: parseInt(student_id),
            },
            include: {
                attendance: true,
                marks: true,
                payment: true,
            },
        });
        if (!studentExist)
            return res
                .status(404)
                .json({ message: "student does not exist!", success: false });
        const { password: _, created_at, updated_at } = studentExist, responseData = __rest(studentExist, ["password", "created_at", "updated_at"]);
        const campusName = yield db_config_1.default.admin.findUnique({
            where: {
                id: studentExist.campusId
            },
            select: {
                schoolName: true
            }
        });
        const campusNameforlogo = yield db_config_1.default.campus.findFirst({
            where: {
                name: campusName === null || campusName === void 0 ? void 0 : campusName.schoolName
            },
            select: {
                logo: true
            }
        });
        const response_Data = Object.assign(Object.assign({}, responseData), { campusName: campusName === null || campusName === void 0 ? void 0 : campusName.schoolName, logo: campusNameforlogo === null || campusNameforlogo === void 0 ? void 0 : campusNameforlogo.logo });
        const studentData = Object.assign(Object.assign({}, response_Data), { contactNumber: responseData.contactNumber.toString(), fatherContactNumber: responseData.fatherContactNumber.toString() });
        return res.status(200).json({
            message: "student data fetched successfully!",
            data: studentData,
            success: true,
        });
    }
    catch (error) {
        console.error("Error in finding student details:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.getStudent = getStudent;
const showAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield db_config_1.default.student.findMany({
            where: {
                campusId: parseInt(req.params.campusId)
            },
            select: {
                id: true,
                name: true,
                rollNo: true,
                email: true,
                role: true,
                gender: true,
                photo: true,
                dob: true,
                contactNumber: true,
                year: true,
                department: true,
                permanent_address: false,
                currentAddress: true,
                fatherName: true,
                motherName: true,
                fatherContactNumber: true,
                attendance: true,
                marks: true,
                payment: true,
            },
        });
        if (students.length == 0)
            return res.status(200).json({
                message: "There are no students exist in this campus.",
                success: false,
            });
        const allStudents = students.map((student) => (Object.assign(Object.assign({}, student), { contactNumber: student.contactNumber.toString(), fatherContactNumber: student.fatherContactNumber.toString() })));
        return res.status(200).json({
            data: allStudents,
            message: "All students fetched successfully!",
            success: true,
        });
    }
    catch (error) {
        console.error("Error fetching students:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.showAllStudents = showAllStudents;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = parseInt(req.params.id);
    const { name, rollNo, email, gender, dob, photo, contactNumber, departmentId, year, permanent_address, currentAddress, fatherName, motherName, fatherContactNumber, } = req.body;
    try {
        const existingStudent = yield db_config_1.default.student.findUnique({
            where: { id: studentId },
        });
        if (!existingStudent) {
            return res
                .status(404)
                .json({ message: "student not found", success: false });
        }
        if (rollNo) {
            const findRollNo = yield db_config_1.default.student.findFirst({
                where: {
                    AND: [
                        { departmentId: parseInt(departmentId) },
                        { rollNo: parseInt(rollNo) },
                    ]
                },
            });
            if (findRollNo) {
                return res
                    .status(409)
                    .json({
                    message: "Student's rollNo already exists!",
                    success: false,
                });
            }
        }
        const updatedStudent = yield db_config_1.default.student.update({
            where: { id: studentId },
            data: {
                name,
                email,
                rollNo,
                gender,
                dob,
                photo,
                contactNumber: contactNumber ? BigInt(contactNumber) : contactNumber,
                departmentId: parseInt(departmentId),
                year: parseInt(year),
                fatherName,
                motherName,
                permanent_address,
                currentAddress,
                fatherContactNumber: fatherContactNumber
                    ? BigInt(fatherContactNumber)
                    : fatherContactNumber,
            },
        });
        const { password: _, created_at, updated_at } = updatedStudent, responseData = __rest(updatedStudent, ["password", "created_at", "updated_at"]);
        const studentData = Object.assign(Object.assign({}, responseData), { contactNumber: responseData.contactNumber.toString(), fatherContactNumber: responseData.fatherContactNumber.toString() });
        return res
            .status(200)
            .json({ message: "student updated", data: studentData, success: true });
    }
    catch (error) {
        console.error("Error updating student:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.updateStudent = updateStudent;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = parseInt(req.params.id);
    try {
        const existingStudent = yield db_config_1.default.student.findUnique({
            where: { id: studentId },
        });
        if (!existingStudent) {
            return res
                .status(404)
                .json({ message: "Student not found", success: false });
        }
        yield db_config_1.default.student.delete({
            where: { id: studentId },
        });
        return res
            .status(200)
            .json({ message: "Student deleted successfully", success: true });
    }
    catch (error) {
        console.error("Error deleting student:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.deleteStudent = deleteStudent;
const deleteAllStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.campusId;
        yield db_config_1.default.student.deleteMany({
            where: { campusId: parseInt(adminId) },
        });
        return res
            .status(200)
            .json({ message: "Student data deleted successfully", success: true });
    }
    catch (error) {
        console.error("Error deleting students:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.deleteAllStudent = deleteAllStudent;
const showAllStudentsByDepartmentandYear = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const campus_id = parseInt(req.params.campusId);
    const dep_id = parseInt(req.params.dep_id);
    const year = parseInt(req.params.year);
    try {
        const students = yield db_config_1.default.student.findMany({
            where: {
                campusId: campus_id,
                departmentId: dep_id,
                year: year,
            },
            select: {
                id: true,
                name: true,
                rollNo: true,
                email: true,
                role: true,
                gender: true,
                dob: true,
                contactNumber: true,
                permanent_address: true,
                currentAddress: true,
                fatherName: true,
                motherName: true,
                fatherContactNumber: true,
            },
            orderBy: {
                rollNo: 'asc',
            },
        });
        if (students.length == 0)
            return res.status(200).json({
                message: "There are no students exist in this department and year.",
                success: false,
            });
        const allStudents = students.map((student) => (Object.assign(Object.assign({}, student), { contactNumber: student.contactNumber.toString(), fatherContactNumber: student.fatherContactNumber.toString() })));
        return res.status(200).json({
            data: allStudents,
            message: "All students fetched successfully!",
            success: true,
        });
    }
    catch (error) {
        console.error("Error fetching students:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.showAllStudentsByDepartmentandYear = showAllStudentsByDepartmentandYear;
