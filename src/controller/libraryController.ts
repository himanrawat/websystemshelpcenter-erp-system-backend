import prisma from "../db/db.config";
import { Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();

export const createBook = async (req: Request, res: Response) => {
  const { file, name, teacherId,subject, campusId } = req.body;
  try {
    const isTeacher=await prisma.teacher.findUnique({
      where:{
        id:parseInt(teacherId),
      },
      select:{
        name:true,
      }
    })
    if(!isTeacher) return res.status(404).json({message:"Teacher does not exist!",success:false});
    const newPdf = await prisma.library.create({
      data: {
        file,
        name,
        teacherId:parseInt(teacherId),
        subject,
        teacherName:isTeacher.name,
        campusId:parseInt(campusId)
      },
    });
    return res
      .status(201)
      .json({ message: "Library created successfully!", data: newPdf,success:true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong! Please try after some time.",error:error,success:false });
  }
};

export const getAllBook = async (req: Request, res: Response) => {
  const campusId=req.params.campusId;
  try {
      const books=await prisma.library.findMany({
        where:{
          campusId:parseInt(campusId),
        },
        select:{
            id:true,
            name:true,
            file:true,
            subject:true,
            teacherName:true,
        }
      })
      if(books.length===0) return res.status(200).json({message:"No book exists in the library",success:false});

      return res
        .status(200)
        .json({ message: "All books fetched successfully!", data: books,success:true });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Something went wrong! Please try after some time.", success:false });
    }
  };


  export const getAllBookByTeacher = async (req: Request, res: Response) => {
    const teacher_id:number=parseInt(req.params.teacher_id);
    try {
      const books=await prisma.library.findMany({
        where:{
          teacherId:teacher_id,
        },
        select:{
            id:true,
            name:true,
            file:true,
            subject:true,
            teacherName:true,
        }
      })
      if(books.length===0) return res.status(200).json({message:"No book exists in the library",success:false});

      return res
        .status(200)
        .json({ message: "All books fetched successfully!", data: books,success:true });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Something went wrong! Please try after some time.", success:false });
    }
  };

  export const deleteBookByTeacher = async (req: Request, res: Response) => {
    const {teacher_id,book_id}=req.params
    try {
      const book=await prisma.library.findFirst({
        where:{
          AND:[
            {id:parseInt(book_id)},
            {teacherId:parseInt(teacher_id)}
          ]
        }
      })
      if(!book) return res.status(200).json({message:"Book related to given teacher does not exists in the library",success:false});

      await prisma.library.delete({
        where:{
            id:parseInt(book_id),
        }
      })
      return res
        .status(200)
        .json({ message: "Book deleted successfully!", success:true });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Something went wrong! Please try after some time.",success:false });
    }
  };
