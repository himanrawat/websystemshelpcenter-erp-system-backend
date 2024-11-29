"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDepartment = exports.deleteDepartment = exports.getAllDepartment = exports.getDepartment = exports.createDepartment = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createDepartment = async (req, res) => {
    const { name, code } = req.body;
    const campus_id = req.params.campusId;
    try {
        const findCampus = await db_config_1.default.admin.findFirst({
            where: {
                id: parseInt(campus_id),
            },
        });
        if (!findCampus)
            return res.status(404).json({ message: "Campus admin does not exist!", success: false, });
        const findDepartment = await db_config_1.default.department.findFirst({
            where: {
                name: name,
                campusId: parseInt(campus_id),
            },
        });
        if (findDepartment) {
            return res.status(409).json({ message: "Department already exists!", success: false, });
        }
        const newDepartment = await db_config_1.default.department.create({
            data: {
                name,
                code,
                campusId: parseInt(campus_id),
            },
        });
        return res
            .status(201)
            .json({ message: "New Department created!", data: newDepartment, success: true });
    }
    catch (error) {
        console.error("Error in creating department:", error);
        return res.status(500).json({ message: "Internal server error", success: false, });
    }
};
exports.createDepartment = createDepartment;
const getDepartment = async (req, res) => {
    const department_id = req.params.dep_id;
    try {
        const departmentExist = await db_config_1.default.department.findFirst({
            where: {
                id: parseInt(department_id),
            },
            include: {
                subjects: true,
                teachers: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        gender: true,
                        dob: true,
                        contactNumber: true,
                        departmentId: true,
                        permanent_address: true,
                        currentAddress: true,
                    },
                },
                students: {
                    select: {
                        name: true,
                        rollNo: true,
                        email: true,
                        gender: true,
                        dob: true,
                        contactNumber: true,
                        permanent_address: true,
                        currentAddress: true,
                        fatherName: true,
                        motherName: true,
                        fatherContactNumber: true,
                    },
                },
            },
        });
        if (!departmentExist)
            return res.status(404).json({ message: "department does not exist!", success: false, });
        const teachersData = departmentExist.teachers.map((teacher) => ({
            ...teacher,
            contactNumber: teacher.contactNumber.toString(),
        }));
        const studentsData = departmentExist.students.map((student) => ({
            ...student,
            contactNumber: student.contactNumber.toString(),
            fatherContactNumber: student.fatherContactNumber.toString(),
        }));
        return res.status(200).json({
            data: {
                ...departmentExist,
                teachers: teachersData,
                students: studentsData,
            },
            message: "department data fetched successfully!",
            success: true
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong.", success: false, });
    }
};
exports.getDepartment = getDepartment;
const getAllDepartment = async (req, res) => {
    try {
        const departments = await db_config_1.default.department.findMany({
            where: {
                campusId: parseInt(req.params.campusId)
            },
            include: {
                subjects: true,
                teachers: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        gender: true,
                        dob: true,
                        contactNumber: true,
                        departmentId: true,
                        permanent_address: true,
                        currentAddress: true,
                    },
                },
                students: {
                    select: {
                        name: true,
                        rollNo: true,
                        email: true,
                        gender: true,
                        dob: true,
                        contactNumber: true,
                        permanent_address: true,
                        currentAddress: true,
                        fatherName: true,
                        motherName: true,
                        fatherContactNumber: true,
                    },
                },
            },
        }); // have to optimize it.
        if (departments.length == 0)
            return res
                .status(404)
                .json({ message: "There are no departments exist in this campus.", success: false, });
        const departmentsData = departments.map((department) => ({
            ...department,
            teachers: department.teachers.map((teacher) => ({
                ...teacher,
                contactNumber: teacher.contactNumber.toString(),
            })),
            students: department.students.map((student) => ({
                ...student,
                contactNumber: student.contactNumber.toString(),
                fatherContactNumber: student.fatherContactNumber.toString(),
            })),
        }));
        return res.status(200).json({
            data: departmentsData,
            message: "All departments fetched successfully!",
            success: true
        });
    }
    catch (error) {
        console.error("Error fetching departments:", error);
        return res.status(500).json({ message: "Internal server error", success: false, });
    }
};
exports.getAllDepartment = getAllDepartment;
const deleteDepartment = async (req, res) => {
    const departmentId = Number(req.params.id);
    const departmentExist = await db_config_1.default.department.findUnique({
        where: {
            id: departmentId,
        },
    });
    if (!departmentExist)
        return res.status(404).json({ message: "Department does not exist!", success: false, });
    await db_config_1.default.department.delete({
        where: {
            id: departmentId,
        },
    });
    return res.status(200).json({ message: "Department deleted!", success: true });
};
exports.deleteDepartment = deleteDepartment;
const updateDepartment = async (req, res) => {
    const { name, code } = req.body;
    const depId = req.params.depId;
    try {
        const findDepartment = await db_config_1.default.department.findFirst({
            where: {
                id: parseInt(depId),
            },
        });
        if (!findDepartment)
            return res.status(404).json({ message: "Department does not exist!", success: false, });
        await db_config_1.default.department.update({
            where: {
                id: parseInt(depId),
            },
            data: {
                name,
                code
            }
        });
        return res
            .status(201)
            .json({ message: "Department updated successfully!", success: true });
    }
    catch (error) {
        console.error("Error in updating department:", error);
        return res.status(500).json({ message: "Internal server error", success: false, });
    }
};
exports.updateDepartment = updateDepartment;
