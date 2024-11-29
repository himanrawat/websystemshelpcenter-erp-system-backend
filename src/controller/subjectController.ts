import prisma from "../db/db.config";
import { Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();

export const createSubject = async (req: Request, res: Response) => {
  const { subjectName, subjectCode, totalLectures,teacherId } = req.body;
  const dep_id = req.params.depId;
  try {
    const findDepartment = await prisma.department.findUnique({
      where: {
        id: parseInt(dep_id),
      },
    });
    if (!findDepartment)
      return res.status(404).json({ message: "Department does not exist!" });

    const findSubject = await prisma.subject.findFirst({
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
    const newSubject = await prisma.subject.create({
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
  } catch (error) {
    console.error("Error in creating subject:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//when we will assign a teacher to a subject we will call update subject to include teacher value in the subject model.
export const getSubject = async (req: Request, res: Response) => {
  const subject_id = req.params.id;
  try {
    const subjectExist = await prisma.subject.findUnique({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong.", success: false });
  }
};

export const updateSubject = async (req: Request, res: Response) => {
  const subId = req.params.subId;
  const { subjectName, subjectCode, totalLectures, teacherId } = req.body;
  try {
    const isSubjectExist = await prisma.subject.findUnique({
      where: {
        id: parseInt(subId),
      },
      select:{
        departmentId:true,
      }
    });
    if (!isSubjectExist)
      return res
        .status(404)
        .json({ message: "Subject does not exist!", success: false });
      if(teacherId){
        const isTeacher = await prisma.teacher.findUnique({
          where: {
            id: parseInt(teacherId),
          },
          select:{
            subject:true,
          }
        });
        if (!isTeacher)
          return res.status(404).json({ message: "Teacher doesn't exist!" });
      }
    await prisma.subject.update({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!", success: false });
  }
};

export const getAllSubject = async (req: Request, res: Response) => {
  const dep_id = req.params.dep_id;
  try {
    const departmentExist = await prisma.department.findUnique({
      where: {
        id: parseInt(dep_id),
      },
    });
    if (!departmentExist)
      return res
        .status(404)
        .json({ message: "Department does not exist!", success: false });

    const subjects = await prisma.subject.findMany({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong.", success: false });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  const subject_id = req.params.subject_id;
  try {
    const subjectExist = await prisma.subject.findUnique({
      where: {
        id: parseInt(subject_id),
      },
    });
    if (!subjectExist)
      return res
        .status(404)
        .json({ message: "Subject does not exist!", success: false });

    await prisma.subject.delete({
      where: {
        id: parseInt(subject_id),
      },
    });
    return res.status(200).json({
      message: "Subject deleted successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong.", success: false });
  }
};
