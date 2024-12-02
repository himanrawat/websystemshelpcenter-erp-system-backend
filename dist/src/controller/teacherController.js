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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleteAllTeacher = exports.deleteTeacher = exports.updateTeacher = exports.showAllTeachers = exports.getTeacher = exports.loginTeacher = exports.createTeacherbyName = exports.createTeacherbyId = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const bcrypt_1 = require("bcrypt");
const jwt = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const mail_1 = require("../utils/mail");
dotenv_1.default.config();
const createTeacherbyId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, gender, dob, photo, contactNumber, departmentId, permanent_address, currentAddress, } = req.body;
    const campus_id = req.params.campusId;
    try {
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
        //     const findDepartment = await prisma.department.findFirst({
        //   where: {
        //     id:departmentId,
        //   },
        // });
        // if (!findDepartment)
        //   return res
        //     .status(404)
        //     .json({ message: "Department does not exist!", success: false });
        const findTeacher = yield db_config_1.default.teacher.findUnique({
            where: {
                email: email,
            },
        });
        if (findTeacher) {
            return res
                .status(409)
                .json({ message: "Teacher already exists!", success: false });
        }
        const newTeacher = yield db_config_1.default.teacher.create({
            data: {
                name,
                email,
                password: hashedPassword,
                AdditionalRole: role,
                gender,
                dob,
                photo,
                contactNumber: BigInt(contactNumber),
                departmentId,
                permanent_address,
                currentAddress,
                campusId: parseInt(campus_id),
            },
        });
        const { password: _, created_at, updated_at } = newTeacher, responseData = __rest(newTeacher, ["password", "created_at", "updated_at"]);
        const teacherData = Object.assign(Object.assign({}, responseData), { contactNumber: responseData.contactNumber.toString() });
        return res
            .status(201)
            .json({ message: "Teacher created!", data: teacherData, success: true });
    }
    catch (error) {
        console.error("Error creating teacher:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.createTeacherbyId = createTeacherbyId;
const createTeacherbyName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, gender, dob, photo, contactNumber, departmentName, permanent_address, currentAddress, } = req.body;
    const campus_id = req.params.campusId;
    try {
        const hashedPassword = (0, bcrypt_1.hashSync)(password, 10);
        const findCampus = yield db_config_1.default.admin.findFirst({
            where: {
                id: parseInt(campus_id),
            },
        });
        const findDepartment = yield db_config_1.default.department.findFirst({
            where: {
                name: departmentName,
            },
        });
        if (!findCampus)
            return res
                .status(404)
                .json({ message: "Campus admin does not exist!", success: false });
        if (!findDepartment)
            return res
                .status(404)
                .json({ message: "Department does not exist!", success: false });
        const findTeacher = yield db_config_1.default.teacher.findUnique({
            where: {
                email: email,
            },
        });
        if (findTeacher) {
            return res
                .status(409)
                .json({ message: "Teacher already exists!", success: false });
        }
        db_config_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const newTeacher = yield tx.teacher.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    AdditionalRole: role,
                    gender,
                    dob,
                    photo,
                    contactNumber: BigInt(contactNumber),
                    departmentId: findDepartment.id,
                    permanent_address,
                    currentAddress,
                    campusId: parseInt(campus_id),
                },
            });
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
            const message = `You have been registered as a teacher in our system. Your password is ${password}. Please keep it safe.`;
            const mailOptions = {
                from: process.env.EMAIL,
                to: newTeacher.email,
                subject: 'Teacher Registration',
                html: (0, mail_1.welcomeEmailTemplateForTeacher)("Teacher Registration", message)
            };
            const info = yield transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.error, info.rejected);
            const { password: _, created_at, updated_at } = newTeacher, responseData = __rest(newTeacher, ["password", "created_at", "updated_at"]);
            const teacherData = Object.assign(Object.assign({}, responseData), { contactNumber: responseData.contactNumber.toString() });
            return res
                .status(201)
                .json({ message: "Teacher created!", data: teacherData, success: true });
        }));
        //   await transporter.sendMail(mailOptions, (error:Error | null, info:any ) => {
        //     if (error) {
        //       console.error("Error sending email:", error);
        //       // tx.$rollback();
        //       return res.status(500).json({ message: "Error sending email", success: false });
        //     } else {
        //       console.log("Email sent: " + info.response);
        //       const { password: _, created_at, updated_at, ...responseData } = newTeacher;
        //       const teacherData = {
        //         ...responseData,
        //         contactNumber: responseData.contactNumber.toString(),
        //       };
        //       return res.status(201).json({ message: "Teacher created and email sent!", data: teacherData, success: true });
        //     }
        //   });
        // });
    }
    catch (error) {
        console.error("Error creating teacher:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.createTeacherbyName = createTeacherbyName;
const loginTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        let teacher = yield db_config_1.default.teacher.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                AdditionalRole: true,
                photo: true,
                subject: {
                    select: {
                        id: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                        subjectName: true,
                        subjectCode: true,
                    },
                },
                departmentId: true,
                password: true,
                campusId: true,
            },
        });
        if (!teacher) {
            return res.status(400).json({
                message: "Email does not exist, please sign up first!",
                success: false,
            });
        }
        if (!(0, bcrypt_1.compareSync)(password, teacher.password)) {
            return res
                .status(400)
                .json({ message: "incorrect email or password!", success: false });
        }
        const admin = yield db_config_1.default.admin.findUnique({
            where: {
                id: teacher === null || teacher === void 0 ? void 0 : teacher.campusId
            },
            select: {
                schoolName: true
            }
        });
        const campus = yield db_config_1.default.campus.findFirst({
            where: {
                name: admin === null || admin === void 0 ? void 0 : admin.schoolName
            }
        });
        const token = jwt.sign({
            id: teacher.id,
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
        const { password: _ } = teacher, teacherData = __rest(teacher, ["password"]);
        const teacherDataWithCampus = Object.assign(Object.assign({}, teacherData), { campuslogo: campus === null || campus === void 0 ? void 0 : campus.logo });
        return res.status(200).json({
            message: "Login successfully!",
            token: token,
            success: true,
            teacherData: teacherDataWithCampus,
        });
    }
    catch (error) {
        console.error("Error in logging the teacher:", error);
        return res.status(500).json({
            message: "Something went wrong. Try after sometime!",
            success: false,
        });
    }
});
exports.loginTeacher = loginTeacher;
const getTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teacher_id = req.params.id;
    try {
        const teacherExist = yield db_config_1.default.teacher.findFirst({
            where: {
                id: parseInt(teacher_id),
            },
            select: {
                id: true,
                name: true,
                email: true,
                AdditionalRole: true,
                campusId: true,
                subject: {
                    select: {
                        id: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                        subjectName: true,
                        subjectCode: true,
                    },
                },
                photo: true,
                gender: true,
                dob: true,
                contactNumber: true,
                departmentId: true,
                permanent_address: true,
                currentAddress: true,
            },
        });
        if (!teacherExist)
            return res
                .status(404)
                .json({ message: "Teacher does not exist!", success: false });
        const campusName = yield db_config_1.default.admin.findUnique({
            where: {
                id: teacherExist.campusId
            },
            select: {
                schoolName: true
            }
        });
        const campus = yield db_config_1.default.campus.findFirst({
            where: {
                name: campusName === null || campusName === void 0 ? void 0 : campusName.schoolName
            }
        });
        const teacherData = Object.assign(Object.assign({}, teacherExist), { contactNumber: teacherExist.contactNumber.toString(), campusName: campusName === null || campusName === void 0 ? void 0 : campusName.schoolName, campusLogo: campus === null || campus === void 0 ? void 0 : campus.logo });
        return res.status(200).json({
            message: "Teacher data fetched successfully!",
            data: teacherData,
            success: true,
        });
    }
    catch (error) {
        console.error("Error in finding teacher details:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.getTeacher = getTeacher;
const showAllTeachers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campusId = req.params.campusId;
        const teachers = yield db_config_1.default.teacher.findMany({
            where: {
                campusId: parseInt(campusId)
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                created_at: true,
                subject: {
                    select: {
                        id: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                        subjectName: true,
                        subjectCode: true,
                    },
                },
                photo: true,
                gender: true,
                dob: true,
                contactNumber: true,
                departmentId: true,
                permanent_address: true,
                currentAddress: true,
            },
        });
        if (teachers.length == 0)
            return res
                .status(200)
                .json({
                message: "There are no teachers exist in this campus.",
                success: false,
            });
        const allTeachers = teachers.map((teacher) => (Object.assign(Object.assign({}, teacher), { contactNumber: teacher.contactNumber.toString() })));
        return res
            .status(200)
            .json({
            data: allTeachers,
            message: "All teachers fetched successfully!",
            success: true,
        });
    }
    catch (error) {
        console.error("Error fetching teachers:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.showAllTeachers = showAllTeachers;
const updateTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherId = parseInt(req.params.id);
    const { name, email, role, departmentId, photo, gender, dob, contactNumber, permanent_address, currentAddress, } = req.body;
    try {
        const existingTeacher = yield db_config_1.default.teacher.findUnique({
            where: { id: teacherId },
        });
        if (!existingTeacher) {
            return res
                .status(404)
                .json({ message: "Teacher not found", success: false });
        }
        if (departmentId) {
            const findDepartment = yield db_config_1.default.department.findUnique({
                where: {
                    id: parseInt(departmentId),
                },
            });
            if (!findDepartment)
                return res
                    .status(404)
                    .json({ message: "Department does not exist!", success: false });
        }
        const updatedTeacher = yield db_config_1.default.teacher.update({
            where: { id: teacherId },
            data: {
                name,
                email,
                AdditionalRole: role,
                photo,
                gender,
                dob,
                contactNumber: contactNumber ? BigInt(contactNumber) : contactNumber,
                departmentId: departmentId ? parseInt(departmentId) : departmentId,
                permanent_address,
                currentAddress,
                updated_at: new Date(),
            },
        });
        const { password: _, created_at, updated_at } = updatedTeacher, responseData = __rest(updatedTeacher, ["password", "created_at", "updated_at"]);
        const teacherData = Object.assign(Object.assign({}, responseData), { contactNumber: responseData.contactNumber.toString() });
        return res
            .status(200)
            .json({ message: "Teacher updated", data: teacherData, success: true });
    }
    catch (error) {
        console.error("Error updating teacher:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.updateTeacher = updateTeacher;
const deleteTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherId = parseInt(req.params.id);
    try {
        const existingTeacher = yield db_config_1.default.teacher.findUnique({
            where: { id: teacherId },
        });
        if (!existingTeacher) {
            return res
                .status(404)
                .json({ message: "Teacher not found", success: false });
        }
        yield db_config_1.default.teacher.delete({
            where: { id: teacherId },
        });
        return res
            .status(200)
            .json({ message: "Teacher deleted successfully", success: true });
    }
    catch (error) {
        console.error("Error deleting teacher:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.deleteTeacher = deleteTeacher;
const deleteAllTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.campusId;
        yield db_config_1.default.teacher.deleteMany({
            where: { campusId: parseInt(adminId) },
        });
        return res
            .status(200)
            .json({ message: "Teacher data deleted successfully", success: true });
    }
    catch (error) {
        console.error("Error deleting teachers:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.deleteAllTeacher = deleteAllTeacher;
