import prisma from "../db/db.config";
import { Request, Response } from "express";
import { format } from "date-fns";
import dotenv from "dotenv";
dotenv.config();

export const markAttendance = async (req: Request, res: Response) => {
  // const adminId=req.params.campusId
  const { subjectId, selectedStudents } = req.body;
  try {
    const isSubject = await prisma.subject.findUnique({
      where: {
        id: parseInt(subjectId),
      },
    });
    if (!isSubject)
      return res
        .status(404)
        .json({ message: "subject does not exist!", success: false });

    const currentDate = new Date();
    const formattedDate = format(currentDate, "dd-MM-yyyy");

    const attendanceExist = await prisma.attendance.findFirst({
      where: {
        AND: [
          {
            date: formattedDate,
          },
          {
            subjectId: subjectId,
          },
        ],
      },
    });
    if (attendanceExist)
      return res.status(409).json({
        message: "Attendance for this date is already marked.",
        success: false,
      });
    const students = await prisma.student.findMany({
      where: {
        departmentId: isSubject.departmentId,
      },
    });
    const attendanceRecords = [];
    for (const student of students) {
      const isPresent = selectedStudents.includes(student.id);
      const attendanceRecord = {
        date: formattedDate,
        status: isPresent ? "Present" : "Absent",
        subjectId,
        studentId: student.id,
      };
      attendanceRecords.push(attendanceRecord);
    }
    const totalLectures: number = isSubject.totalLectureTaken + 1;
    await prisma.attendance.createMany({
      data: attendanceRecords,
    });
    await prisma.subject.update({
      where: {
        id: parseInt(subjectId),
      },
      data: {
        totalLectureTaken: totalLectures,
      },
    });
    res
      .status(200)
      .json({ message: "Attendance marked successfully", success: true });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
};

export const updateAttendance = async (req: Request, res: Response) => {
  const { subjectId, selectedStudents, date } = req.body;
  try {
    const isSubject = await prisma.subject.findUnique({
      where: {
        id: parseInt(subjectId),
      },
    });
    if (!isSubject)
      return res
        .status(404)
        .json({ message: "subject does not exist!", success: false });

    const students = await prisma.student.findMany({
      where: {
        departmentId: isSubject.departmentId,
      },
    });
    await prisma.attendance.deleteMany({
      where: {
        AND: [
          {
            date: date,
          },
          {
            subjectId: subjectId,
          },
        ],
      },
    });
    const attendanceRecords = [];
    for (const student of students) {
      const isPresent = selectedStudents.includes(student.id);
      const attendanceRecord = {
        date: date,
        status: isPresent ? "Present" : "Absent",
        subjectId,
        studentId: student.id,
      };
      attendanceRecords.push(attendanceRecord);
    }
    await prisma.attendance.createMany({
      data: attendanceRecords,
    });
    res
      .status(202)
      .json({ message: "Attendance updated successfully", success: true });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
};

export const getPercentage = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(studentId),
      },
      select: {
        departmentId:true,
        attendance: true,
      },
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found", success: false });
    }


    
    const attendanceRecords = student.attendance;

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({
        message: "No attendance records found for this subject on this date!",
        success: false,
      });
    }

    const subjects = await prisma.subject.findMany({
      where: {
        departmentId: student.departmentId,
      },
      select: {
        id: true,
        subjectName: true,
      },
    });
    if (!subjects || subjects.length === 0) {
      return res.status(404).json({
        message: "No subjects found for this department",
        success: false,
      });
    }


    const attendancePercentages = subjects.map(subject => {
      let present = 0;
      let absent = 0;

      for (const attendance of attendanceRecords) {
        if (attendance.subjectId === subject.id) {
          if (attendance.status === "Present") {
            present++;
          } else {
            absent++;
          }}}

          const totalLectures = present + absent;
      const percentage = totalLectures === 0 ? 0 : (present * 100) / totalLectures;
      return {
        subjectId: subject.id,
        subject: subject.subjectName,
        percentage,
      };
    });

    return res.status(200).json({
      message: "Attendance of the percentages fetched successfully!",
      data: attendancePercentages,
      success: true,

    });
  } catch (error) {
    console.error("Error fetching attendance percentages:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};

export const getAttendanceOnADate = async (req: Request, res: Response) => {
  const { date, subjectId } = req.params;
  try {
    // const formattedDate = format(date, "dd-MM-yyyy");
    const subject = await prisma.subject.findUnique({
      where: {
        id: parseInt(subjectId),
      },
    });
    if (!subject) {
      return res
        .status(404)
        .json({ message: "subject not found", success: false });
    }
    const presentStudents=await prisma.attendance.findMany({
      where:{
        AND:[
          {date:date},
          {subjectId:parseInt(subjectId)},
        ]
      }
    })
    if (!presentStudents || presentStudents.length === 0) {
      return res.status(404).json({
        message: "No attendance records found for this subject on this date!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Attendance of the students fetched successfully!",
      success: true,
      subject: subject.subjectName,
      date:date,
      data: presentStudents,
    });
  } catch (error) {
    console.error("Error fetching attendance on a particular date and in a particular subject:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};


export const markFacultyAttendance = async (req: Request, res: Response) => {
  const adminId=req.params.campusId
  const { date, selectedTeachers } = req.body;
  try {
    const formattedDate = new Date(date);
    const isAttendanceExist = await prisma.facultyAttendance.findUnique({
      where: {
        date: formattedDate,
      },
    });
    if (isAttendanceExist)
      return res
        .status(409)
        .json({
          success: false,
          message: "Attendance is already marked for this date!",
        });
    await prisma.facultyAttendance.create({
      data: {
        adminId:parseInt(adminId),
        date:formattedDate,
        presentTeachers: selectedTeachers,
      },
    });
    return res
      .status(200)
      .json({ message: "attendance marked!", success: true });
  } catch (error) {
    console.log(error);
    return res.json(500).json({ message: "something went wrong!" });
  }
};

export const getFacultyAttendance = async (req: Request, res: Response) => {
  try {
    const {onDate,campusId} = req.params;
    const date = onDate ? new Date(onDate) : new Date();
    const attendanceOfFaculty = await prisma.facultyAttendance.findMany({
      where: {
        date: date,
        adminId:parseInt(campusId)
      },
      select: {
        presentTeachers: true,
      },
    });
    if (attendanceOfFaculty.length === 0)
      return res
        .status(404)
        .json({
          message: "No attendance exists for selected date!",
          success: false,
        });

    const presentTeachers = attendanceOfFaculty[0].presentTeachers as number[];

    const teachers = await prisma.teacher.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    const attendanceStatus = teachers.map((teacher) => ({
      id: teacher.id,
      name: teacher.name,
      status: presentTeachers.includes(teacher.id) ? "Present" : "Absent",
    }));

    return res
      .status(200)
      .json({
        message: "Attendance fetched successfully!",
        success: true,
        attendanceStatus,
        date:date,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Something went wrong, try after sometime!",
        success: false,
      });
  }
};

export const updateFacultyAttendance = async (req: Request, res: Response) => {
  const adminId=req.params.campusId
  const { date, selectedTeachers } = req.body;
  try {
    const formattedDate = new Date(date).toISOString(); // Ensure date is in ISO-8601 format
    const isAttendanceExist = await prisma.facultyAttendance.findUnique({
      where: {
        date: formattedDate,
        adminId: parseInt(adminId),
      },
    });
    if (!isAttendanceExist) {
      return res.status(409).json({
        success: false,
        message: "Attendance was not marked on this date!",
      });
    }
    await prisma.facultyAttendance.update({
      where: {
        date: formattedDate,
        adminId: parseInt(adminId),
      },
      data: {
        presentTeachers: selectedTeachers,
      },
    });
    return res.status(200).json({ message: "Attendance updated successfully!", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!", success: false });
  }
};

export const getFacultyAttendanceById = async (
  req: Request,
  res: Response
) => {
  const adminId=req.params.campusId
  const { date, id } = req.params;
  try {
    const formattedDate = new Date(date);
    const attendanceOfFaculty = await prisma.facultyAttendance.findMany({
      where: {
        date: formattedDate,
        adminId:parseInt(adminId)
      },
      select: {
        presentTeachers: true,
      },
    });
    if (attendanceOfFaculty.length === 0)
      return res.status(404).json({
        message: "No attendance exists for selected date!",
        success: false,
      });

    const presentTeachers = attendanceOfFaculty[0].presentTeachers as number[];
    const isPresent = presentTeachers.includes(parseInt(id));
    return res
      .status(200)
      .json({
        success:true,
        message: "Fetched successfully",
        date: date,
        status: isPresent ? "Present" : "Absent",
      });
  } catch (error) {
    console.log(error);
    return res.json(500).json({ message: "something went wrong!", success:false });
  }
};

export const getAttendenceByDate=async(req:Request,res:Response)=>{
  const adminId=req.params.campusid
  const {startDate, endDate}=req.body;
  try {

    const campusId=prisma.admin.findFirst({
      where:{
        id:parseInt(adminId)
      }
    })

    if(!campusId){
      return res.status(404).json({
        message:"Campus id not found",
        success:false
      })
    }

    const attendanceRecord =await prisma.facultyAttendance.findFirst({
      where:{
        adminId:parseInt(adminId),
        date:{
          gte:startDate,
          lte:endDate
        }
      },
      select:{
        presentTeachers:true
      }
    })

    return res.status(200).json({
      message:"Attendance fetched successfully",
      success:true,
      data:attendanceRecord
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Something went wrong",
      success:false
    })
  }
}