import express, { Router } from "express";
const router: Router = express.Router();
import {
  createDepartment,
  getDepartment,
  getAllDepartment,
  deleteDepartment,
  updateDepartment,
} from "../controller/departmentController";

router.post("/:campusId/reg", createDepartment);
router.get("/fetch/:dep_id", getDepartment);
router.get("/fetchAll/:campusId", getAllDepartment);
router.delete("/delete/:id", deleteDepartment);
router.put("/update/:depId", updateDepartment);

export default router;
