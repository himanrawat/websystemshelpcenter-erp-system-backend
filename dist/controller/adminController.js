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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentbyYear = exports.createPayment = exports.createSupport = exports.logout = exports.resetPassword = exports.forgetPassword = exports.deleteAdmin = exports.showAdminById = exports.fetchAdmins = exports.updateAdmin = exports.loginAdmin = exports.verifyEmail = exports.createAdmin = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const bcrypt_1 = require("bcrypt");
const jwt = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const date_fns_1 = require("date-fns");
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_1 = require("../utils/mail");
const helper_1 = require("../utils/helper");
let config = {
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
};
const createAdmin = async (req, res) => {
    const { name, email, password, photo, branchId, role, subscriptionExpiryDate, } = req.body;
    try {
        const hashedPassword = (0, bcrypt_1.hashSync)(password, 10);
        const findAdmin = await db_config_1.default.admin.findUnique({
            where: { email: email },
        });
        if (findAdmin) {
            return res.status(406).json({
                message: "Email already taken. Please use another one or login",
                success: false,
            });
        }
        const branch = await db_config_1.default.branch.findUnique({
            where: { id: branchId },
        });
        if (!branch) {
            return res.status(404).json({
                message: "Branch not found",
                success: false,
            });
        }
        const newAdmin = await db_config_1.default.admin.create({
            data: {
                name,
                email,
                password: hashedPassword,
                branchId,
                branchName: branch.name,
                photo: photo,
                role,
                // subscriptionExpiryDate,
            },
        });
        const campus = await db_config_1.default.campus.findUnique({
            where: {
                id: branch.campusId,
            },
        });
        if (!campus) {
            return res.status(404).json({
                message: "Campus not found",
                success: false,
            });
        }
        const adminData = await db_config_1.default.admin.update({
            where: {
                id: newAdmin.id,
            },
            data: {
                schoolName: campus.name,
            },
        });
        const otpResult = await (0, helper_1.sendOtp)(email);
        if (!otpResult.success) {
            return res.status(403).json({
                message: otpResult.message,
                success: false,
            });
        }
        return res.status(201).json({
            data: { ...adminData, password: "" },
            message: "Admin created and verification email has been sent.",
            success: true,
        });
    }
    catch (error) {
        console.error("Error creating admin:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};
exports.createAdmin = createAdmin;
const verifyEmail = async (req, res) => {
    const { otp } = req.body;
    const id = req.params.id;
    if (!id || !otp.trim())
        return res.status(400).json({
            success: false,
            message: "Invalid request, missing parameters!",
        });
    const admin = await db_config_1.default.admin.findFirst({
        where: {
            id: parseInt(id),
        },
    });
    if (!admin)
        return res.status(404).json({ success: false, message: "User not exist!" });
    if (admin.isVerified)
        return res.status(400).json({
            success: false,
            message: "This account is already verified!",
        });
    const otp_token = await db_config_1.default.otpToken.findFirst({
        where: {
            email: admin.email,
        },
    });
    if (!otp_token)
        return res
            .status(404)
            .json({ success: false, message: "Sorry user not found!" });
    const isMatched = (0, bcrypt_1.compareSync)(otp, otp_token.token);
    if (!isMatched)
        return res
            .status(400)
            .json({ success: false, message: "Provide a valid otp" });
    await db_config_1.default.admin.update({
        where: {
            id: admin.id,
        },
        data: {
            isVerified: true,
        },
    });
    await db_config_1.default.otpToken.deleteMany({
        where: {
            email: admin.email,
        },
    });
    let transporter = nodemailer_1.default.createTransport(config);
    let message = {
        from: process.env.EMAIL,
        to: admin.email,
        subject: "Welcome email",
        html: (0, mail_1.welcomeEmailTemplate)("Email verified Successfully", "Thanks for connecting with us"),
    };
    transporter.sendMail(message, (error) => {
        if (error) {
            console.error(error);
            res
                .status(500)
                .json({ error: "Error sending welcome email", success: false });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Your email is verified, and welcome email sent",
                data: admin,
            });
        }
    });
    res.status(202).send({ success: true, message: "Verified successfully!" });
};
exports.verifyEmail = verifyEmail;
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        let admin = await db_config_1.default.admin.findUnique({
            where: {
                email: email,
            },
        });
        if (!admin) {
            return res.status(400).json({
                message: "Email does not exist, please sign up first!",
                success: false,
            });
        }
        if (admin.isVerified == false) {
            const otpResult = await (0, helper_1.sendOtp)(email);
            if (!otpResult.success) {
                return res.status(403).json({
                    message: otpResult.message,
                    success: false,
                });
            }
            return res.status(401).json({
                message: "You need to verify your email and otp is already sent on email.",
                success: false,
            });
        }
        if (!(0, bcrypt_1.compareSync)(password, admin.password)) {
            return res
                .status(400)
                .json({ message: "incorrect email or password!", success: false });
        }
        const campus = await db_config_1.default.campus.findFirst({
            where: {
                name: admin.schoolName,
            },
        });
        if (!campus) {
            return res.status(404).json({
                message: "Campus not found",
                success: false,
            });
        }
        const token = jwt.sign({
            id: admin.id,
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        //res.cookie("token", token, { maxAge: 3600000, httpOnly: true }); // Max age in milliseconds (1 hour)
        return res.status(202).json({
            message: "Login successfully!",
            token: token,
            success: true,
            data: {
                id: admin.id,
                name: admin.name,
                isVerified: admin.isVerified,
                role: admin.role,
                email: admin.email,
                schoolName: admin.schoolName,
                branchId: admin.branchId,
                branchName: admin.branchName,
                photo: admin.photo,
                campusId: campus.id,
            },
        });
    }
    catch (error) {
        console.error("Error in logging the admin:", error);
        return res.status(500).json({
            message: "Something went wrong. Try after sometime!",
            success: false,
        });
    }
};
exports.loginAdmin = loginAdmin;
const updateAdmin = async (req, res) => {
    const adminId = Number(req.params.id);
    const { name, email, schoolName, photo } = req.body;
    console.log(adminId);
    try {
        const admin = await db_config_1.default.admin.findFirst({
            where: {
                id: adminId,
            },
        });
        if (!admin) {
            return res
                .status(404)
                .json({ message: "Admin Not found!", success: false });
        }
        await db_config_1.default.admin.update({
            where: {
                id: adminId,
            },
            data: {
                name,
                email,
                schoolName,
                photo,
            },
        });
        return res.status(202).json({ message: "Admin updated!", success: true });
    }
    catch (error) {
        console.log(error);
        return res
            .status(503)
            .json({ message: "Something went wrong!", success: false });
    }
};
exports.updateAdmin = updateAdmin;
// export const fetchAdmins = async (req: Request, res: Response) => {
//   try {
//     const admins = await prisma.admin.findMany({
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         schoolName: true,
//         role: true,
//         created_at: true,
//       },
//     });
//     if (admins.length === 0)
//       return res
//         .status(200)
//         .json({ message: "There are no admin exist!", success: true });
//     return res.status(200).json({
//       data: admins,
//       success: true,
//       message: "Data fetched successfully!",
//     });
//   } catch (error) {
//     console.error("Error fetching admins:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", success: false });
//   }
// };
const fetchAdmins = async (req, res) => {
    try {
        const admins = await db_config_1.default.admin.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                schoolName: true,
                role: true,
                created_at: true,
            },
        });
        if (admins.length === 0) {
            console.log("No admins found in the database");
            return res.status(200).json({
                message: "There are no admin exist!",
                success: true,
            });
        }
        return res.status(200).json({
            data: admins,
            success: true,
            message: "Data fetched successfully!",
        });
    }
    catch (error) {
        console.error("Error fetching admins:", error); // Log the full error
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
exports.fetchAdmins = fetchAdmins;
const showAdminById = async (req, res) => {
    const adminId = Number(req.params.id);
    try {
        const admin = await db_config_1.default.admin.findFirst({
            where: {
                id: adminId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                schoolName: true,
                role: true,
                photo: true,
                created_at: true,
            },
        });
        if (!admin) {
            return res
                .status(404)
                .json({ message: "Admin not found", success: false });
        }
        return res.status(200).json({
            data: admin,
            success: true,
            message: "admin fetched successfully!",
        });
    }
    catch (error) {
        console.error("Error showing admin:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};
exports.showAdminById = showAdminById;
const deleteAdmin = async (req, res) => {
    const adminId = Number(req.params.id);
    const adminExist = await db_config_1.default.admin.findUnique({
        where: {
            id: adminId,
        },
    });
    if (!adminExist)
        return res
            .status(404)
            .json({ message: "Admin does not exist!", success: false });
    const adminDeleted = await db_config_1.default.admin.delete({
        where: {
            id: adminId,
        },
    });
    if (!adminDeleted)
        return res
            .status(404)
            .json({ message: "Admin data not deleted!", success: false });
    return res.status(200).json({ message: "Admin deleted!", success: true });
};
exports.deleteAdmin = deleteAdmin;
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res
            .status(400)
            .json({ message: "Please provide a valid email!", success: false });
    let user = await db_config_1.default.admin.findUnique({
        where: {
            email: email,
        },
    });
    if (!user)
        return res.status(404).send({
            success: false,
            message: "User not found Invalid request!",
        });
    const reset_token = await db_config_1.default.resetToken.findFirst({
        where: {
            ownerId: user.id,
        },
    });
    console.log(reset_token);
    // if (reset_token && reset_token?.expiresAt > new Date())
    //   return res
    //     .status(208)
    //     .json({ success: false, message: "Try again after 5 minutes!" });
    // else if
    if (reset_token && reset_token?.expiresAt < new Date()) {
        await db_config_1.default.resetToken.delete({
            where: {
                ownerId: user.id,
            },
        });
    }
    const rand_token = (0, helper_1.generateRandomToken)(15);
    const expiresAt = (0, date_fns_1.addMinutes)(new Date(), 5);
    await db_config_1.default.resetToken.create({
        data: {
            ownerId: user.id,
            token: rand_token,
            expiresAt: expiresAt,
        },
    });
    let transporter = nodemailer_1.default.createTransport(config);
    let message = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Password Reset",
        html: (0, mail_1.generatePasswordResetTemplate)(`https://campus-erp-admin.vercel.app/reset-password/${rand_token}/${user.id}`),
    };
    transporter.sendMail(message, (error) => {
        if (error) {
            console.error(error);
            res.status(502).send({
                success: false,
                message: "Error while sending reset password email",
            });
        }
        else {
            return res.status(202).send({
                success: true,
                message: "Password reset link is sent to your email",
            });
        }
    });
};
exports.forgetPassword = forgetPassword;
const resetPassword = async (req, res) => {
    // console.log(req.params);
    const id = req.params.id;
    const { password } = req.body;
    try {
        const user = await db_config_1.default.admin.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found!" });
        }
        const isSamePassword = (0, bcrypt_1.compareSync)(password, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from the old one!",
            });
        }
        if (password.trim().length < 8 || password.trim().length > 20) {
            return res.status(400).json({
                success: false,
                message: "Password must be between 8 to 20 characters!",
            });
        }
        // Update user's password
        const hashedPassword = (0, bcrypt_1.hashSync)(password, 10);
        await db_config_1.default.admin.update({
            where: {
                id: parseInt(id),
            },
            data: {
                password: hashedPassword,
            },
        });
        await db_config_1.default.resetToken.deleteMany({
            where: {
                ownerId: parseInt(id),
            },
        });
        let transporter = nodemailer_1.default.createTransport(config);
        let message = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Password Reset Successfully",
            html: (0, mail_1.changedPasswordEmailTemplate)("Password Reset Successfully", "Now you can login with your new password!"),
        };
        transporter.sendMail(message, (error) => {
            if (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: "Error sending reset password confirmation email",
                });
            }
            else {
                res
                    .status(202)
                    .json({ success: true, message: "Password changed successfully." });
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.resetPassword = resetPassword;
const logout = async (req, res) => {
    res.cookie("token", "", { maxAge: 1, httpOnly: true });
    return res
        .status(202)
        .json({ message: "Logout successfully!", success: true });
};
exports.logout = logout;
const createSupport = async (req, res) => {
    const { name, email, contactNo, type, photo, query } = req.body;
    try {
        let complaintId = (0, helper_1.generate_id)();
        const newQuery = await db_config_1.default.support.create({
            data: {
                name,
                email,
                contactNo: BigInt(contactNo),
                type,
                photo,
                query,
                complaintNo: complaintId,
            },
        });
        let transporter = nodemailer_1.default.createTransport(config);
        let message = {
            from: process.env.EMAIL,
            to: email,
            subject: "Portal support",
            html: (0, mail_1.supportTemplate)(complaintId, name, email, contactNo, query),
        };
        const queryData = {
            ...newQuery,
            contactNo: newQuery.contactNo.toString(),
        };
        transporter.sendMail(message, (error) => {
            if (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ error: "Error sending support email", success: false });
            }
            else {
                res.status(200).json({
                    success: true,
                    message: "Your query has been sent successfully!",
                    queryData,
                });
            }
        });
        res.status(201).json({
            message: "Your query has been sent successfully!",
            queryData,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating support ticket" });
    }
};
exports.createSupport = createSupport;
const createPayment = async (req, res) => {
    const department_id = req.params.dep_id;
    const { description, amount, title } = req.body;
    try {
        const departmentExist = await db_config_1.default.department.findUnique({
            where: {
                id: parseInt(department_id),
            },
            include: {
                students: true,
            },
        });
        if (!departmentExist) {
            return res
                .status(404)
                .json({ message: "department does not exist!", success: false });
        }
        const studentsData = departmentExist.students.map((student) => db_config_1.default.payment.create({
            data: {
                amount: amount,
                description: description,
                studentId: student.id,
                localTransactionId: "",
                title: title,
            },
        }));
        const payment = await Promise.all(studentsData);
        console.log(payment);
        return res.status(200).json({
            message: "sucessfully created",
            success: true,
        });
    }
    catch (error) {
        console.log(error, "create payment");
        res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
exports.createPayment = createPayment;
const createPaymentbyYear = async (req, res) => {
    const department_id = req.params.dep_id;
    const year = req.params.year;
    const { description, amount, title } = req.body;
    try {
        const departmentExist = await db_config_1.default.department.findUnique({
            where: {
                id: parseInt(department_id),
            },
            include: {
                students: {
                    where: {
                        year: parseInt(year),
                    },
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (!departmentExist)
            return res
                .status(404)
                .json({ message: "department does not exist!", success: false });
        const studentsData = departmentExist.students.map((student) => {
            return db_config_1.default.payment.create({
                data: {
                    amount: amount,
                    description: description,
                    studentId: student.id,
                    localTransactionId: "",
                    title: title,
                },
            });
        });
        const payment = await Promise.all(studentsData);
        return res.status(200).json({
            message: "sucessfully created",
            success: true,
        });
    }
    catch (error) {
        console.log(error, "create payment");
        res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
exports.createPaymentbyYear = createPaymentbyYear;
