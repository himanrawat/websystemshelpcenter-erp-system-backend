import prisma from "../db/db.config";
import { Request, Response } from "express";
import { Worker } from 'worker_threads';
import dotenv from "dotenv";

dotenv.config();


export const getpayment=async(req:Request,res:Response)=>{
  const studentid=req.params.id
  try{
    const payment=await prisma.student.findUnique({
      where: {
        id: parseInt(studentid)
      },
      select: {
        name: true,
        email: true,
        rollNo:true,
        payment:true,
      }
    })
    if (!payment){
      res.status(404).json({
        message:"Student not found"
      })
    }
    else{
      res.status(200).json({ message: "Payment fetched Successfully", data: payment });

    
  } }catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
    
  
}

export const createPaymentdetails = async (req: Request, res: Response) => {
  const { studentid, paymentid } = req.params;
  const { amount } = req.body;
  console.log(amount, "amount", studentid, "id", paymentid, "paymentid")
  try {
    const studentdetails = await prisma.student.findUnique({
      where: {
        id: parseInt(studentid)
      },
      select: {
        name: true,
        email: true,
        contactNumber: true
      }
    });

    if (!studentdetails) {
      return res.status(404).json({ message: "Student not found" });
    }

    const updatepayment=await prisma.payment.update({
      where:{
        id:parseInt(paymentid)
      },
      data:{
        status:"paid",
      }
    })

      const update = await prisma.paymentdetails.create({
        data: {
          message: "",
          paymentId: parseInt(paymentid),
          status: "paid",
          amount: parseFloat(amount),
          description: "",
        },
      });
      res.status(200).json({ message: "Payment URL Generated Successfully", data: updatepayment });

    
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};


export const getPaymentDetails = async (req: Request, res: Response) => {
  const  paymentId  = parseInt(req.params.paymentid);
  console.log(paymentId,"paymentId")
  try {

    const paymentdetails = await prisma.payment.findUnique({
      where: {
          id: paymentId  // Correct field name used
          
      },
      select: {
          id: true,
          status:true,
          paymentdetails:true,
      }
  })
    if (!paymentdetails) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment Details Fetched Successfully", data: paymentdetails });
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
  // const worker=new Worker('./src/worker/payment/paymentDetails.ts', { workerData: { paymentId } });

  // worker.on('message', (message) => {
  //   res.status(200).json({ message: "Payment Details Fetched Successfully", data: message });
  // });

  // worker.on('error', (error) => {
  //   res.status(500).json({ message: "Internal Server Error", error: error.message });
  // });


};

export const createPaymentforStudent=async(req:Request,res:Response)=>{
  const {studentid}=req.params
  const {amount,title,description}=req.body
  try{
    const student=await prisma.student.findUnique({
      where:{
        id:parseInt(studentid)
      }
    })
    const payment=await prisma.payment.create({
      data:{
        amount:amount,
        title:title,
        description:description,
        studentId:parseInt(studentid),
        localTransactionId:"",
      }
    })
    res.status(200).json({message:"Payment Created Successfully",data:payment})
  }
  catch(error){
    res.status(500).json({message:"Internal Server Error",error:error})
  }
}




