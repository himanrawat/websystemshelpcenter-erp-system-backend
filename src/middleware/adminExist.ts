import { Response, NextFunction, Request } from "express";
import prisma from "../db/db.config";

export const adminExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = req.params.campusId;
    if (!adminId)
      return res.status(400).json({ message: "Please provide a admin id." });
    const isAdmin = await prisma.admin.findUnique({
      where: {
        id: parseInt(adminId),
      },
    });
    if (!isAdmin)
      return res.status(404).json({ message: "admin does not exist." });
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message:"Something went wrong." });
  }
};
