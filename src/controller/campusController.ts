import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllCampus = async (req: Request, res: Response) => {
    try {
        const campus = await prisma.campus.findMany();
        return res.status(200).json({ message: "Campus fetched successfully!", success: true, data: campus });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong! Please try after some time.", success: false });
    }
}

export const getCampusById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const campus = await prisma.campus.findUnique({
            where: { id: Number(id) }
        });
        return res.status(200).json({ message: "Campus fetched successfully!", success: true, data: campus });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong! Please try after some time.", success: false });
    }
  }
export const getCampusByname = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const campus = await prisma.campus.findFirst({
            where: { name }
        });
        return res.status(200).json({ message: "Campus fetched successfully!", success: true, data: campus });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong! Please try after some time.", success: false });
    }
  }


export const createCampus = async (req: Request, res: Response) => {
    const { name,logo, location,role,foundedYear } = req.body;
   let newCampus:any;
  try{
    await prisma.$transaction(async (tx) => {
       newCampus = await tx.campus.create({
        data: {
        name,
          logo,
          location, 
          foundedYear
      },
    });
    });
    
    return res.status(201).json({
      data: newCampus,
      message: "Campus created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error creating campus:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
  };
  
export const updateCampus = async (req: Request, res: Response) => {
    const { id, name, logo, location,  foundedYear } = req.body;
    try {
        const campus = await prisma.campus.update({
            where: { id },
            data: { name, logo, location, foundedYear }
        });
        return res.status(200).json({ message: "Campus updated successfully!", success: true, data: campus });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong! Please try after some time.", success: false });
    }
}
  
export const createBranch = async (req: Request, res: Response) => {
    const { BranchName,location,campusId,subscriptionExpiryDate } = req.body;
  
    try{
       
        const branch2=await prisma.branch.findFirst({
          where:{
            name:BranchName,
            location:location,
            campusId:campusId
          }
        });
    
  
        if(branch2){
          return res.status(400).json({
          message: "Branch already exist",
          success: false,
        });
      }
  
      const campus=await prisma.campus.findFirst({
        where:{
          id:campusId
        }
      })
      if(!campus){
        return res.status(400).json({
          message: "Campus not found",
          success: false,
        });
      }
  
      const branch=await prisma.branch.create({
        data:{
          name:BranchName,
          campusId:campus.id,
          location:location
        }
      })
  
  
    //   prisma.$transaction(async (tx) => {
    //   await Promise.all( 
  
    //     BranchName.map(async (branch:string)=>{
    //       newBranch = await tx.branch.create({
    //         data: {
    //           name:branch,
    //           campusId,
    //         },
    //       });
  
    
  
    //     const branchid=await tx.branch.findFirst({
    //       where:{
    //         name:adminbranch,
    //         campusId:campusId
    //       }
    //     })
    //     if(branchid){
    //     await tx.admin.update({
    //       where: {
    //         id: adminId,
    //       },
    //       data: {
    //         branchId: branchid.id,
    //         },
    //       });
    //     }
    //   })
    // )
    //   })
      return res.status(201).json({
        data:branch,
        message: "Branch created successfully",
        success: true,
      });   
    }catch(error){
    console.error("Error creating branch:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
  }

  
export const deleteBranch = async (req: Request, res: Response) => {
    const { branchName,campusId } = req.body;
   try{
    let branchExist:any;
  
    await prisma.$transaction(async (tx) => {
  
    // branchExist= await branchName.map(async (branch:string)=>{
    //   branchExist=await tx.branch.findFirst({
    //     where:{
    //       name:branch,
    //       campusId:campusId
    //     }
    //   })
    // })
  console.log(branchName)
  await Promise.all(branchName.map(async (branch: any) => {
      const branchRecord = await tx.branch.findFirst({
          where: {
              name: branch,
              campusId: campusId
          },
          select: {
              id: true
          }
      });
      if (branchRecord) {
          await tx.branch.delete({
              where: {
                  id: branchRecord.id
              },
          });
      }
  }));
    })
    
      
      return res.status(200).json({
        message: "Branch deleted successfully",
        success: true,
      });
    }catch(error){
      console.error("Error deleting branch:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  };

// export const campusupdate = async (req: Request, res: Response) => {
//   const { id, name, logo, location, foundedYear } = req.body;
//   try {
// const campus = await prisma.campus.findFirst({
//   where:{
//     id:id
//   }
// })
// if(!campus){
//   return res.status(400).json({
//     message: "Campus not found",
//     success: false,
//   });
// }
//     const campus = await prisma.campus.update({
//       where: { id },
//       data: { name, logo, location, foundedYear }
//     });
//   }catch(error){
//     console.error("Error updating campus:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", success: false });
//   }
// }