import { Request, Response } from "express";
import prisma from "../db/db.config";
import { Result, ResultResponse } from '../types/types';
import { validateResultData, validatePartialResultData } from "../middleware/validateResult";

export const createResults = async (req: Request, res: Response) => {
  const results: Result[] = req.body;

  for (const result of results) {
    const validationError = validateResultData(result);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
  }

  try {
    const newResults = [];
    for (const result of results) {
      const existingResult = await prisma.marks.findFirst({
        where: {
          studentId: result.studentId,
          subjectId: result.subjectId
        }
      });

      if (existingResult) {
        return res.status(400).json({ message: `Result already exists for studentId ${result.studentId} and subjectId ${result.subjectId}` });
      }

      const newResult = await prisma.marks.create({
        data: {
          totalMarks: result.totalMarks,
          scoredMarks: result.scoredMarks,
          grade: result.grade,
          subjectId: result.subjectId,
          studentId: result.studentId,
          feedback:String(result.feedback),
        },
      });

      newResults.push(newResult);
    }

    return res.status(201).json({ data: newResults, message: "Results created successfully." });
  } catch (error) {
    console.error("Error creating results:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateResultPartial = async (req: Request, res: Response) => {
  const studentId = Number(req.params.studentId);
  const subjectId = Number(req.params.subjectId);
  const { totalMarks, scoredMarks, grade, feedback } = req.body as Partial<Result>;

  const validationError = validatePartialResultData(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const existingResult = await prisma.marks.findFirst({
      where: { studentId, subjectId }
    });

    if (!existingResult) {
      return res.status(404).json({ message: "Result not found for the specified student and subject." });
    }

    const updatedData: Partial<Result> = {};
    if (totalMarks !== undefined) updatedData.totalMarks = totalMarks;
    if (scoredMarks !== undefined) updatedData.scoredMarks = scoredMarks;
    if (grade !== undefined) updatedData.grade = grade;
    updatedData.feedback=feedback
    
    const updatedResult = await prisma.marks.update({
      where: { id:  existingResult.id },
      data:  updatedData,
    });

    return res.status(200).json({ data: updatedResult, message: "Result updated successfully." });
  } catch (error) {
    console.error("Error updating result:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateFullResult = async (req: Request, res: Response) => {
  const studentId = Number(req.params.studentId);
  const { totalMarks, scoredMarks, grade, subjectId } = req.body as Result;

  const validationError = validateResultData(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const existingResult = await prisma.marks.findFirst({
      where: { studentId, subjectId }
    });

    if (!existingResult) {
      return res.status(404).json({ message: "Result not found for the specified student and subject." });
    }

    const updatedResult = await prisma.marks.update({
      where: { id: existingResult.id },
      data: { totalMarks, scoredMarks, grade },
    });

    return res.status(200).json({ data: updatedResult, message: "Result updated successfully." });
  } catch (error) {
    console.error("Error updating result:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getResultById = async (req: Request, res: Response) => {
  const studentId = Number(req.params.studentId);

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        marks: {
          include: {
            subject: true,
          },
          orderBy: {
            subjectId: 'asc'
          }
        },
        campus: true,
      }
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

// Group marks by subject ID and aggregate total marks and scored marks
    const resultsMap = new Map<number, { 
    subjectId: number, 
    subjectName: string, 
    totalMarks: number, 
    scoredMarks: number, 
    grade: string ,
    feedback: string,
  }>();
    student.marks.forEach(mark => {
      const subject = mark.subject;
      if (subject && typeof subject.id === 'number') {
        const { id, subjectName } = subject;
        const existingResult = resultsMap.get(id);
        if (existingResult) {
          existingResult.totalMarks += mark.totalMarks;
          existingResult.scoredMarks += mark.scoredMarks;
        } else {
          resultsMap.set(id, {
            subjectId: id,
            subjectName: subjectName ?? "Unknown",
            totalMarks: mark.totalMarks,
            scoredMarks: mark.scoredMarks,
            grade: mark.grade,
            feedback: mark.feedback,
          });
        }
      }
    });

    const results = Array.from(resultsMap.values());
    const totalMarks = results.reduce((acc, result) => acc + result.totalMarks, 0);
    const totalScoredMarks = results.reduce((acc, result) => acc + result.scoredMarks, 0);

    const response: ResultResponse = {
      student: {
        id: student.id,
        name: student.name,
        fatherName: student.fatherName,
        rollNo: student.rollNo,
        campus: student.campus?.schoolName ?? "Unknown"
      },
      results,
      totalMarks,
      totalScoredMarks
    };

    return res.status(200).json({ data: response });
  } catch (error) {
    console.error("Error fetching student results:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllResults = async (req: Request, res: Response) => {
  try {
    const results = await prisma.marks.findMany({
      include: {
        student: {
          include: {
            campus: true,
          },
        },
        subject: true,
      },
    });

   const resultsByStudent = results.reduce<Record<number, {
      student: {
        id: number, 
        name: string, 
        fatherName: string, 
        rollNo: number, 
        campus: string
      }, 
      results: {
        subjectId: number, 
        subjectName: string, 
        totalMarks: number, 
        scoredMarks: number, 
        grade: string
      }[], 
      totalMarks: number, 
      totalScoredMarks: number
    }>>((acc, result) => {
      if (result.student) {
        const studentId = result.student.id;
        if (!acc[studentId]) {
          acc[studentId] = {
            student: {
              id: result.student.id,
              name: result.student.name,
              fatherName: result.student.fatherName,
              rollNo: result.student.rollNo,
              campus: result.student.campus?.schoolName ?? "Unknown"
            },
            results: [],
            totalMarks: 0,
            totalScoredMarks: 0
          };
        }

        const existingSubject = acc[studentId].results.find(res => res.subjectId === result.subjectId);
        if (existingSubject) {
          existingSubject.totalMarks += result.totalMarks;
          existingSubject.scoredMarks += result.scoredMarks;
        } else {
          acc[studentId].results.push({
            subjectId: result.subjectId,
            subjectName: result.subject?.subjectName ?? "Unknown",
            totalMarks: result.totalMarks,
            scoredMarks: result.scoredMarks,
            grade: result.grade
          });
        }

        acc[studentId].totalMarks += result.totalMarks;
        acc[studentId].totalScoredMarks += result.scoredMarks;
      }
      return acc;
    }, {});

    return res.status(200).json({ data: Object.values(resultsByStudent) });
  } catch (error) {
    console.error("Error fetching results:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteResultPartial = async (req: Request, res: Response) => {
  const resultId = Number(req.params.resultId);

  try {
    await prisma.marks.delete({
      where: { id: resultId },
    });
    return res.status(200).json({ message: "Result deleted successfully." });
  } catch (error) {
    console.error("Error deleting result:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteResults = async (req: Request, res: Response) => {
  const studentId = Number(req.params.studentId);

  try {
    await prisma.marks.deleteMany({
      where: { studentId },
    });
    return res.status(200).json({ message: "Student results deleted successfully." });
  } catch (error) {
    console.error("Error deleting student results:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


