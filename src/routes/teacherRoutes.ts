import express, { Router } from "express";
const router: Router = express.Router();
import {
  createTeacherbyId,
  createTeacherbyName,
  getTeacher,
  showAllTeachers,
  updateTeacher,
  deleteTeacher,
  loginTeacher,
  deleteAllTeacher
} from "../controller/teacherController";
import { logout, createSupport} from "../controller/adminController";

import { validateUser, validate } from "../middleware/validator";
import { adminExist } from "../middleware/adminExist";

router.post("/:campusId/reg", validateUser, validate, createTeacherbyId);
router.post("/:campusId/regbyname", validateUser, validate, createTeacherbyName);
router.post("/login",loginTeacher)
router.get("/:campusId/fetch/:id",adminExist, getTeacher);
router.get("/:campusId/fetchAll",adminExist, showAllTeachers);
router.put("/:campusId/update/:id",adminExist, updateTeacher);
router.delete("/:campusId/delete/:id",adminExist, deleteTeacher);
router.delete("/:campusId/deleteAllTeacher", adminExist, deleteAllTeacher);
router.post("/logout", logout);
router.post("/support",createSupport)

export default router;
