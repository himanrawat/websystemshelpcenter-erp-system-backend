import prisma from "../db/db.config";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const monthNames: string[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
interface Holiday {
  id: number;
  date: Date;
  reason: string;
  teacherId: number;
}
interface HolidayResponse {
  id: number;
  date: string; 
  reason: string;
  teacherId: number;
}
interface HolidaysByMonth {
  [key: string]: HolidayResponse[];
}
export const createHoliday = async (req: Request, res: Response) => {
  const teacherId: number = parseInt(req.params.teacherId);
  let { date, reason, campusId } = req.body;
  try {
    date = new Date(date);
    const isTeacher = await prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },
      select: {
        AdditionalRole: true,
      },
    });
    if (!isTeacher || isTeacher.AdditionalRole !== "class teacher") {
      return res.status(400).json({
        message: "You are not allowed to mark the holiday!",
        success: false,
      });
    }
    const isHoliday = await prisma.holiday.findUnique({
      where: {
        date: date,
      },
    });
    if (isHoliday)
      return res
        .status(409)
        .json({
          success: false,
          message: "Holiday for this date is already marked!",
        });
    const holiday = await prisma.holiday.create({
      data: {
        date: new Date(date),
        reason,
        teacherId,
        campusId
      },
    });
    res.status(201).json({ success: true, message: "", holiday });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getHoliday = async (req: Request, res: Response) => {
  const campusId:number=parseInt(req.params.campusId);
  try {
    const holidays: Holiday[] = await prisma.holiday.findMany({
      orderBy: {
        date: "asc",
      },
      where:{
        campusId:campusId
      }
    });
    const holidaysByMonth: HolidaysByMonth = holidays.reduce((acc: HolidaysByMonth, holiday: Holiday) => {
      const month: number = holiday.date.getMonth(); // getMonth() is zero-indexed
      const monthName: string = monthNames[month];
      const formattedHoliday: HolidayResponse = {
        id: holiday.id,
        date: holiday.date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        reason: holiday.reason,
        teacherId: holiday.teacherId
      };
      if (!acc[monthName]) {
        acc[monthName] = [];
      }
      acc[monthName].push(formattedHoliday);
      return acc;
    }, {} as HolidaysByMonth);
    res.status(200).json(holidaysByMonth);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const getHolidayOnDate = async (req: Request, res: Response) => {
    const givenDate=req.params.date;
    const campusId:number=parseInt(req.params.campusId);
    try {
        const date=new Date(givenDate);
      const holiday = await prisma.holiday.findUnique({
        where:{
            date:date,
            campusId:campusId
        }
      });
      if(!holiday) return res.status(200).json({success:true,message:"No holiday on this date"});
      res.status(200).json({success:true,message:"It's a holiday on given date!"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
export const updateHoliday = async (req: Request, res: Response) => {
  const teacherId: number = parseInt(req.params.teacherId);
  const holiday_id:number=parseInt(req.params.holidayId);
  let { date, reason } = req.body;
  try {
    if(date) date = new Date(date);
    const isTeacher = await prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },
      select: {
        AdditionalRole: true,
      },
    });
    if (!isTeacher || isTeacher.AdditionalRole !== "class teacher") {
      return res.status(400).json({
        message: "You are not allowed to modify the holiday!",
        success: false,
      });
    }
    const isHoliday = await prisma.holiday.findUnique({
      where: {
        id:holiday_id
      },
    });
    if (!isHoliday)
      return res
        .status(404)
        .json({
          success: false,
          message: "Holiday for this date is not present!",
        });
    const holiday = await prisma.holiday.update({
      where: {
        id:holiday_id
      },
      data: {
        date: date || isHoliday.date,
        reason,
        teacherId,
      },
    });
    res
      .status(200)
      .json({ success: true, message: "update successfully!", holiday });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const deleteHoliday = async (req: Request, res: Response) => {
  const teacherId = parseInt(req.params.teacherId);
  const holiday_id:number=parseInt(req.params.holidayId);
  try {
    const isHoliday = await prisma.holiday.findUnique({
      where: {
        id:holiday_id,
      },
    });
    if (!isHoliday)
      return res
        .status(404)
        .json({
          success: false,
          message: "holiday is not present for this date!",
        });
    const isTeacher = await prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },
      select: {
        AdditionalRole: true,
      },
    });
    if (!isTeacher || isTeacher.AdditionalRole !== "class teacher") {
      return res.status(401).json({
        message: "You are not allowed to delete the holiday!",
        success: false,
      });
    }
    await prisma.holiday.delete({
      where: {
        id:holiday_id,
      },
    });
    res.status(200).json({ success: true, message: "deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};