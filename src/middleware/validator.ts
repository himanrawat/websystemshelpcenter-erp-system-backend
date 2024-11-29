import { Request, Response, NextFunction } from "express";
import { check, validationResult, ValidationChain } from "express-validator";

export const validateUser: ValidationChain[] = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is missing")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be between 3 to 20 characters"),

  check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),

  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 to 20 characters"),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).array();
  if (!errors.length) return next();

  res.send({ success: false, message: errors[0].msg });
};
