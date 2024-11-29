import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {  generate_id } from "../utils/helper";
import nodemailer from "nodemailer";
import {
  supportTemplate,
} from "../utils/mail";

import dotenv from "dotenv";
dotenv.config();

let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    secure: true, // added for SSL
    port: 465,
  };
  

const prisma = new PrismaClient();

export const createSupport = async (req: Request, res: Response) => {
    const { name, email, contactNo, year, query ,type,errorrole,errorpage,department,photo,campusName} = req.body;
    try {
      let complaintId = generate_id();
      let transporter = nodemailer.createTransport(config);
  
      let message = {
        from: process.env.EMAIL,
        to: [process.env.EMAIL,email],
        subject: "Portal support",
        html: supportTemplate(complaintId, name, email, contactNo, query),
      };

      await prisma.$transaction(async (prisma) => {
        await transporter.sendMail(message);
        const newQuery = await prisma.support.create({
          data: {
            name,
            email,
            contactNo: BigInt(contactNo),
            query,
            complaintNo: complaintId,
            type,
            year,
            department,
            photo,
            errorrole,
            errorpage,
            campusName
          },
        });
        const queryData = {
          ...newQuery,
          contactNo: newQuery.contactNo.toString(),
        };
        res.status(200).json({
          success: true,
          message: "Your query has been sent successfully!",
          queryData,
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating support ticket or sending email" });
    }
  };

export const updateSupport=async(req:Request,res:Response)=>{
    const id=req.params.complaintNo;
    const {status,reply}=req.body;
    try{
        const updatedSupport=await prisma.support.update({
            where:{
                complaintNo:String(id)
            },
            data:{
                status,
                reply
            }
        })
        
        res.status(200).json({
            message:"Support updated successfully",
            
        });
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error"});
    }
}



export const getSupportRequestByfilter=async(req:Request,res:Response)=>{
   try{
    if(req.query.type && req.query.status && req.query.department){
        const type=req.query.type;
        const status=req.query.status;
        const department=req.query.department;
        const supportRequests=await prisma.support.findMany({
            where:{
                type:String(type),
                status:String(status),
                department:String(department)
            }
        });
        const result= supportRequests.map((supportRequest)=>{
         return {
             ...supportRequest,
             contactNo:supportRequest.contactNo.toString()
         }
        })
        res.status(200).json({
            message:"Support Requests fetched successfully",
            result
        });
    }
    else if(req.query.type && req.query.status){
        const type=req.query.type;
        const status=req.query.status
        const supportRequest=await prisma.support.findMany({
            where:{
                type:String(type),
                status:String(status)
            }
        });
        const result= supportRequest.map((supportRequest)=>{
         return {
             ...supportRequest,
             contactNo:supportRequest.contactNo.toString()
         }
        })
        res.status(200).json({
            message:"Support Requests fetched successfully",
            result
        });
    }
    else  if(req.query.type  && req.query.department){
        const type=req.query.type;
        const department=req.query.department;
        const supportRequest=await prisma.support.findMany({
            where:{
                type:String(type),
                department:String(department)
            }
        });
        const result= supportRequest.map((supportRequest)=>{
         return {
             ...supportRequest,
             contactNo:supportRequest.contactNo.toString()
         }
        })
        res.status(200).json({
            message:"Support Requests fetched successfully",
            result
        });
    }
    else  if(req.query.status && req.query.department){
        const status=req.query.status;
        const department=req.query.department;
        const supportRequest=await prisma.support.findMany({
            where:{
                status:String(status),
                department:String(department)
            }
        });
        const result= supportRequest.map((supportRequest)=>{
         return {
             ...supportRequest,
             contactNo:supportRequest.contactNo.toString()
         }
        })
        res.status(200).json({
            message:"Support Requests fetched successfully",
            result
        });
    }
    else if(req.query.type){
        const type=req.query.type;
        const supportRequest=await prisma.support.findMany({
            where:{
                type:String(type)
            }
        });
        const result= supportRequest.map((supportRequest)=>{
         return {
             ...supportRequest,
             contactNo:supportRequest.contactNo.toString()
         }
        })
        res.status(200).json({
            message:"Support Requests fetched successfully",
            result
        });
    }
    else if(req.query.status){
        const status=req.query.status;
        const supportRequest=await prisma.support.findMany({
            where:{
                status:String(status)
            }
        });
        const result= supportRequest.map((supportRequest)=>{
         return {
             ...supportRequest,
             contactNo:supportRequest.contactNo.toString()
         }
        })
        res.status(200).json({
            message:"Support Requests fetched successfully",
            result
        });
    }
    else  if(req.query.department){
        const department=req.query.department;
        const supportRequest=await prisma.support.findMany({
            where:{
                department:String(department)
            }
        });
        const result= supportRequest.map((supportRequest)=>{
         return {
             ...supportRequest,
             contactNo:supportRequest.contactNo.toString()
         }
        })
        res.status(200).json({
            message:"Support Requests fetched successfully",
            result
        });
    }
    else{
        const supportRequests=await prisma.support.findMany();
        const supportRequestsWithContactNo=supportRequests.map((supportRequest)=>{
         return {
             ...supportRequest,
             contactNo:supportRequest.contactNo.toString()
         }
        })
         res.status(200).json({
             message:"Support Requests fetched successfully",
             supportRequests:supportRequestsWithContactNo
         });
    }


}catch(error){
    res.status(500).json({message:"Internal Server Error"});
}
}


// status