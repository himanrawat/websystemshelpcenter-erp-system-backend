import { Request as ExpressRequest, Response, NextFunction, Request } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import prisma from "../db/db.config";
import { RequestHandler } from "express-serve-static-core";
import dotenv from "dotenv";
dotenv.config();

// Define an interface that extends Express's Request interface
interface AuthenticatedRequest extends ExpressRequest {
  userId?: number; // This allows adding userId to the Request object
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: "Unauthorized user!" });
  }
  console.log(process.env.JWT_SECRET)
  try {
    const decoded = jwt.verify(String(token), process.env.JWT_SECRET!) as {
      id: number;
    };
    console.log(decoded)
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong!" });
  }
};


export const isResetTokenValid = async (
  req: Request, 
  res: Response,
  next: NextFunction
) => {
  const { token, id } = req.params;
  if (!token || !id) {
    return res.json({ status: 400, message: "Invalid request!" });
  }

  const user = await prisma.admin.findFirst({
    where: {
      id: parseInt(id), 
    },
  });
  if (!user) {
    return res.json({ status: 400, message: "User Not Found" });
  }

  try {
    const resToken = await prisma.resetToken.findFirst({
      where: {
        ownerId: parseInt(id), 
      },
    });
    if (!resToken) {
      return res.json({ status: 400, message: "Invalid request!" });
    }
    if (resToken && resToken?.expiresAt<new Date()) {
      await prisma.resetToken.delete({
        where: {
          ownerId: user.id,
        },
      });
      return res.json({status:400, message:"Time out please try again!"})
    }

    // const isValid = compareSync(resToken.token, token);

    if (resToken.token!==token) {
      return res.json({ status: 400, message: "Token not valid!" });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.json({ status: 400, message: "Internal server error!" });
  }
};


export const isOtpValid = async (
  req: Request, 
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) {
    return res.json({ status: 400, message: "Invalid request!" });
  }
  const user = await prisma.admin.findFirst({
    where: {
      id: parseInt(id), 
    },
  });
  if (!user) {
    return res.json({ status: 400, message: "User Not Found" });
  }

  try {
    const otp_token = await prisma.otpToken.findFirst({
      where: {
        email: user.email, 
      },
    });
    if (!otp_token) {
      return res.json({ status: 400, message: "Invalid request!" });
    }
    if (otp_token && otp_token?.expiresAt<new Date()) {
      await prisma.otpToken.delete({
        where: {
          email: user.email,
        },
      });
      return res.json({status:400, message:"Time out please try again!"})
    }
    next();
  } catch (error) {
    console.error(error);
    return res.json({ status: 400, message: "Internal server error!" });
  }
};


export const isAdmin: RequestHandler = async (req, res, next) => {
  try {
    const authorizationToken = req.headers.authorization;
    const token = authorizationToken?.split("Bearer ")[1];
    if (!token) return res.status(403).json({ error: "unauthorized access!" });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    const user = await prisma.admin.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!user) return res.status(403).json({ success:false,message: "unauthorized access!" });
    if(!(user.role==="admin")) res.status(403).json({success:false, message:"You doesn't have access to admin page."})
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(403).json({success:false,message: "unauthorized access!" });
    } else {
      res.status(500).json({ success:false,message: "Something went wrong!" });
    }
  }
};

export const isTeacher: RequestHandler = async (req, res, next) => {
  try {
    const authorizationToken = req.headers.authorization;
    const token = authorizationToken?.split("Bearer ")[1];
    if (!token) return res.status(403).json({ error: "unauthorized access!" });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    const user = await prisma.teacher.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!user) return res.status(403).json({ success:false,message: "unauthorized access!" });
    if(!(user.role==="teacher")) res.status(403).json({success:false, message:"You doesn't have access to teacher's page."})
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(403).json({success:false,message: "unauthorized access!" });
    } else {
      res.status(500).json({ success:false,message: "Something went wrong!" });
    }
  }
};

export const isStudent: RequestHandler = async (req, res, next) => {
  try {
    const authorizationToken = req.headers.authorization;
    const token = authorizationToken?.split("Bearer ")[1];
    if (!token) return res.status(403).json({ error: "unauthorized access!" });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    const user = await prisma.student.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!user) return res.status(403).json({ success:false,message: "unauthorized access!" });
    if(!(user.role==="student")) res.status(403).json({success:false, message:"You doesn't have access to student's page."})
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(403).json({success:false,message: "unauthorized access!" });
    } else {
      res.status(500).json({ success:false,message: "Something went wrong!" });
    }
  }
};