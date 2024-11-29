import prisma from "../db/db.config";
import { Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();

type ScheduleEntry = {
  subjectId: number;
  teacherId: number;
  subjectName: string;
  teacherName: string;
  timeFrom: string;
  timeTo: string;
};

export const createTimeTable = async (req: Request, res: Response) => {
  const {
    departmentId,
    monday = [],
    tuesday = [],
    wednesday = [],
    thursday = [],
    friday = [],
    saturday = [],
  } = req.body;
  const teacherId = req.params.teacher_id;
  try {
    const isTeacher = await prisma.teacher.findUnique({
      where: {
        id: parseInt(teacherId),
      },
      select: {
        id: true,
        AdditionalRole: true,
      },
    });
    if (!isTeacher || isTeacher.AdditionalRole !== "class teacher") {
      return res
        .status(400)
        .json({
          message: "You are not allowed to add the time table!",
          success: false,
        });
    }
    const isClass = await prisma.department.findUnique({
      where: {
        id: parseInt(departmentId),
      },
      select: {
        name: true,
      },
    });
    if (!isClass)
      return res
        .status(404)
        .json({ message: "class does not exist!", success: false });
    const timeTableData = {
      departmentId: parseInt(departmentId),
      departmentName: isClass.name,
      monday: monday || null,
      tuesday: tuesday || null,
      wednesday: wednesday || null,
      thursday: thursday || null,
      friday: friday || null,
      saturday: saturday || null,
    };
    const newTimeTable = await prisma.timeTable.create({
      data: timeTableData,
    });
    return res
      .status(201)
      .json({
        message: "time table uploaded successfully!",
        newTimeTable,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Something went wrong! Please try after some time.",
        success: false,
      });
  }
};

export const getTimeTableByDepartment = async (req: Request, res: Response) => {
  const dep_id: number = parseInt(req.params.dep_id);
  try {
    const isDepartment = await prisma.department.findUnique({
      where: {
        id: dep_id,
      },
    });
    if (!isDepartment)
      return res
        .status(404)
        .json({ message: "Department not found!", success: false });
    const timeTable = await prisma.timeTable.findMany({
      where: {
        departmentId: dep_id,
      },
      select: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
      },
    });
    return res
      .status(200)
      .json({
        message: "Time table fetched successfully!",
        success: true,
        timeTable,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "something went wrong!", success: false });
  }
};

export const updateTimeTable = async (req: Request, res: Response) => {
  const {
    departmentId,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
  } = req.body;
  const teacherId = req.params.teacher_id;
  try {
    const isTeacher = await prisma.teacher.findUnique({
      where: {
        id: parseInt(teacherId),
      },
      select: {
        AdditionalRole: true,
      },
    });
    if (!isTeacher || isTeacher.AdditionalRole !== "class teacher") {
      return res
        .status(400)
        .json({
          message: "You are not allowed to update the time table!",
          success: false,
        });
    }
    const existingTimeTable = await prisma.timeTable.findUnique({
      where: {
        departmentId: parseInt(departmentId),
      },
    });

    if (!existingTimeTable) {
      return res
        .status(404)
        .json({
          message: "Timetable for this class does not exist!",
          success: false,
        });
    }
    const timeTableData = {
      monday: monday ?? existingTimeTable.monday,
      tuesday: tuesday ?? existingTimeTable.tuesday,
      wednesday: wednesday ?? existingTimeTable.wednesday,
      thursday: thursday ?? existingTimeTable.thursday,
      friday: friday ?? existingTimeTable.friday,
      saturday: saturday ?? existingTimeTable.saturday,
    };

    const updatedTimeTable = await prisma.timeTable.update({
      where: {
        id: existingTimeTable.id,
      },
      data: timeTableData,
    });
    return res
      .status(201)
      .json({
        message: "time table uploaded successfully!",
        updatedTimeTable,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Something went wrong! Please try after some time.",
        success: false,
      });
  }
};

export const getTimeTableByTeacherAndDay = async (
  req: Request,
  res: Response
) => {
  const teacherId: number = parseInt(req.params.teacherId);
  const day = req.params.day.toLowerCase();
  try {
    const timetable = await prisma.timeTable.findMany({
      where: {
        [day]: {
          not: null,
        },
      },
      select: {
        [day]: true,
      },
    });

    // console.log(JSON.stringify(timetable, null, 2));
    if (!timetable || timetable.length === 0) {
      return res
        .status(404)
        .json({
          message: "No timetable found for the specified day!",
          success: false,
        });
    }

    const daySchedules = timetable
      .map((entry) => entry[day])
      .flat() as ScheduleEntry[];

    // console.log(daySchedules)
    const filteredSchedules = daySchedules.filter(
      (schedule) => schedule.teacherId === teacherId
    );

    if (filteredSchedules.length === 0) {
      return res
        .status(404)
        .json({
          message:
            "No timetable entries found for the specified teacher and day!",
          success: false,
        });
    }

    return res
      .status(200)
      .json({ timetable: filteredSchedules, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Something went wrong! Please try again later.",
        success: false,
      });
  }
};
