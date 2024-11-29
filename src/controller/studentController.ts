import prisma from "../db/db.config";
import { Request, Response } from "express";

import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createStudent = async (req: Request, res: Response) => {
  const {
    name,
    rollNo,
    email,
    password,
    gender,
    dob,
    photo,
    contactNumber,
    departmentId,
    year,
    permanent_address,
    currentAddress,
    fatherName,
    motherName,
    fatherContactNumber,
  } = req.body;
  const campus_id = req.params.campusId;
  try {
    const findDepartment = await prisma.department.findFirst({
      where: {
        id: parseInt(departmentId),
      },
    });
    if (!findDepartment)
      return res
        .status(404)
        .json({ message: "That Department does not exist!", success: false });
    const hashedPassword = hashSync(password, 10);
    const findCampus = await prisma.admin.findFirst({
      where: {
        id: parseInt(campus_id),
      },
    });
    if (!findCampus)
      return res
        .status(404)
        .json({ message: "Campus admin does not exist!", success: false });

    const findStudent = await prisma.student.findFirst({
      where: {
        OR:[
          {email:email},
          {AND:[
            {departmentId:parseInt(departmentId)},
            {OR: [{ email: email }, { rollNo }]},
          ]}
        ]
      },
    });

    if (findStudent) {
      if(findStudent.email===email){
        return res
          .status(409)
          .json({
            message: "Student's email already exists!",
            success: false,
          });
      }
      if (
        findStudent.departmentId === parseInt(departmentId) &&
        findStudent.rollNo === rollNo
      ) {
        return res.status(409).json({
          message: "Student's roll number already exists in this department!",
          success: false,
        });
      }
    }
    const newStudent = await prisma.student.create({
      data: {
        name,
        rollNo,
        email,
        password: hashedPassword,
        gender,
        dob,
        photo,
        contactNumber: BigInt(contactNumber),
        departmentId:parseInt(departmentId),
        year:parseInt(year),
        permanent_address,
        currentAddress,
        campusId: parseInt(campus_id),
        fatherName,
        motherName,
        fatherContactNumber: BigInt(fatherContactNumber),
      },
    });
    const { password: _, created_at, updated_at, ...responseData } = newStudent;
    const studentData = {
      ...responseData,
      contactNumber: responseData.contactNumber.toString(),
      fatherContactNumber: responseData.fatherContactNumber.toString(),
    };
    return res
      .status(201)
      .json({ message: "Student created!", data: studentData, success: true });
  } catch (error) {
    console.error("Error creating student:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const loginStudent = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    let student = await prisma.student.findUnique({
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

    if (!compareSync(password, student.password)) {
      return res
        .status(400)
        .json({ message: "incorrect email or password!", success: false });
    }

    const token = jwt.sign(
      {
        id: student.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    // res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

    return res.status(200).json({
      message: "Login successfully!",
      token: token,
      success: true,
      data: {
        id: student.id,
        name: student.name,
        role: student.role,
        photo:student.photo,
        email: student.email,
        school: student.departmentId,
        gender: student.gender,
        campusId:student.campusId,
      },
    });
  } catch (error) {
    console.error("Error in logging the student:", error);
    return res.status(500).json({
      message: "Something went wrong. Try after sometime!",
      success: false,
    });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  const student_id = req.params.id;
  try {
    const studentExist = await prisma.student.findFirst({
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

    const {
      password: _,
      created_at,
      updated_at,
      ...responseData
    } = studentExist;

    const campusName=await prisma.admin.findUnique({
      where:{
        id:studentExist.campusId
      },
      select:{
        schoolName:true
      }
    })

    const campusNameforlogo=await prisma.campus.findFirst({
      where:{
        name:campusName?.schoolName
      },
      select:{
        logo:true
      }
    })

    const response_Data={...responseData,campusName:campusName?.schoolName,logo:campusNameforlogo?.logo}

    const studentData = {
      ...response_Data,
      contactNumber: responseData.contactNumber.toString(),
      fatherContactNumber: responseData.fatherContactNumber.toString(),
    };
    return res.status(200).json({
      message: "student data fetched successfully!",
      data: studentData,
      success: true,
    });
  } catch (error) {
    console.error("Error in finding student details:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const showAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      where:{
        campusId:parseInt(req.params.campusId)
      },  
      select: {
        id: true,
        name: true,
        rollNo: true,
        email: true,
        role: true,
        gender: true,
        photo:true,
        dob: true,
        contactNumber: true,
        year:true,
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
    const allStudents = students.map((student) => ({
      ...student,
      contactNumber: student.contactNumber.toString(),
      fatherContactNumber: student.fatherContactNumber.toString(),
    }));
    return res.status(200).json({
      data: allStudents,
      message: "All students fetched successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.id);
  const {
    name,
    rollNo,
    email,
    gender,
    dob,
    photo,
    contactNumber,
    departmentId,
    year,
    permanent_address,
    currentAddress,
    fatherName,
    motherName,
    fatherContactNumber,
  } = req.body;

  try {
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!existingStudent) {
      return res
        .status(404)
        .json({ message: "student not found", success: false });
    }
    if (rollNo) {
      const findRollNo = await prisma.student.findFirst({
        where: {
          AND:[
            {departmentId:parseInt(departmentId)},
            {rollNo: parseInt(rollNo)},
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

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        name,
        email,
        rollNo,
        gender,
        dob,
        photo,
        contactNumber: contactNumber ? BigInt(contactNumber) : contactNumber,
        departmentId:parseInt(departmentId),
        year:parseInt(year),
        fatherName,
        motherName,
        permanent_address,
        currentAddress,
        fatherContactNumber: fatherContactNumber
          ? BigInt(fatherContactNumber)
          : fatherContactNumber,
      },
    });

    const {
      password: _,
      created_at,
      updated_at,
      ...responseData
    } = updatedStudent;
    const studentData = {
      ...responseData,
      contactNumber: responseData.contactNumber.toString(),
      fatherContactNumber: responseData.fatherContactNumber.toString(),
    };

    return res
      .status(200)
      .json({ message: "student updated", data: studentData, success: true });
  } catch (error) {
    console.error("Error updating student:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.id);

  try {
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!existingStudent) {
      return res
        .status(404)
        .json({ message: "Student not found", success: false });
    }

    await prisma.student.delete({
      where: { id: studentId },
    });

    return res
      .status(200)
      .json({ message: "Student deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting student:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const deleteAllStudent = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.campusId;
    await prisma.student.deleteMany({
      where: { campusId: parseInt(adminId) },
    });

    return res
      .status(200)
      .json({ message: "Student data deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting students:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const showAllStudentsByDepartmentandYear = async (req: Request, res: Response) => {
  const campus_id:number=parseInt(req.params.campusId);
  const dep_id:number=parseInt(req.params.dep_id);
  const year:number=parseInt(req.params.year);
  try {
    const students = await prisma.student.findMany({
      where:{
        campusId:campus_id,
        departmentId:dep_id,
        year:year,
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
    const allStudents = students.map((student) => ({
      ...student,
      contactNumber: student.contactNumber.toString(),
      fatherContactNumber: student.fatherContactNumber.toString(),
    }));
    return res.status(200).json({
      data: allStudents,
      message: "All students fetched successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
