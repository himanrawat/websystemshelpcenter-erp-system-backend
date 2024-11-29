import prisma from "../db/db.config";
import { Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();

export const createDepartment = async (req: Request, res: Response) => {
  const { name, code } = req.body;
  const campus_id = req.params.campusId;
  try {
    const findCampus = await prisma.admin.findFirst({
      where: {
        id: parseInt(campus_id),
      },
    });
    if (!findCampus)
      return res.status(404).json({ message: "Campus admin does not exist!",success:false, });

    const findDepartment = await prisma.department.findFirst({
      where: {
        name: name,
        campusId: parseInt(campus_id),
      },
    });

    if (findDepartment) {
      return res.status(409).json({ message: "Department already exists!",success:false, });
    }
    const newDepartment = await prisma.department.create({
      data: {
        name,
        code,
        campusId: parseInt(campus_id),
      },
    });
    return res
      .status(201)
      .json({ message: "New Department created!", data: newDepartment,success:true });
  } catch (error) {
    console.error("Error in creating department:", error);
    return res.status(500).json({ message: "Internal server error",success:false, });
  }
};

export const getDepartment = async (req: Request, res: Response) => {
  const department_id = req.params.dep_id;
  try {
    const departmentExist = await prisma.department.findFirst({
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
      return res.status(404).json({ message: "department does not exist!",success:false, });

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
      success:true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong.",success:false, });
  }
};

export const getAllDepartment = async (req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      where:{
        campusId:parseInt(req.params.campusId)
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
        .json({ message: "There are no departments exist in this campus.",success:false, });
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
      success:true
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({ message: "Internal server error",success:false, });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  const departmentId = Number(req.params.id);
  const departmentExist = await prisma.department.findUnique({
    where: {
      id: departmentId,
    },
  });
  if (!departmentExist)
    return res.status(404).json({ message: "Department does not exist!",success:false, });
  await prisma.department.delete({
    where: {
      id: departmentId,
    },
  });

  return res.status(200).json({ message: "Department deleted!",success:true });
};

export const updateDepartment = async (req: Request, res: Response) => {
  const { name, code } = req.body;
  const depId = req.params.depId;
  try {
    const findDepartment = await prisma.department.findFirst({
      where: {
        id: parseInt(depId),
      },
    });
    if (!findDepartment)
      return res.status(404).json({ message: "Department does not exist!",success:false, });

    await prisma.department.update({
      where: {
        id: parseInt(depId),
      },
      data:{
        name,
        code
      }
    });
    return res
      .status(201)
      .json({ message: "Department updated successfully!",success:true});
  } catch (error) {
    console.error("Error in updating department:", error);
    return res.status(500).json({ message: "Internal server error",success:false, });
  }
};
