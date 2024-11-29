import express, { Router } from "express";
const router: Router = express.Router();
import {
  createStudent,
  getStudent,
  showAllStudents,
  updateStudent,
  deleteStudent,
  deleteAllStudent,
  loginStudent,
  showAllStudentsByDepartmentandYear,
} from "../controller/studentController";
import { logout } from "../controller/adminController";

import { validateUser, validate } from "../middleware/validator";
import { adminExist } from "../middleware/adminExist";

router.post("/:campusId/reg", validateUser, validate, createStudent);
router.post("/login", loginStudent);
router.get("/:campusId/fetch/:id", adminExist, getStudent);
router.get("/:campusId/fetchAll", adminExist, showAllStudents);
router.put("/:campusId/update/:id", adminExist, updateStudent);
router.delete("/:campusId/deleteStudent/:id", adminExist, deleteStudent);
router.delete("/:campusId/deleteAllStudent", adminExist, deleteAllStudent);
router.post("/logout", logout);
router.get("/:campusId/fetchByDepartment/:dep_id/:year", adminExist, showAllStudentsByDepartmentandYear);

export default router;
