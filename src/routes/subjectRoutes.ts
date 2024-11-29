import express, { Router } from "express";
const router: Router = express.Router();
import {
  createSubject,
  getSubject,
  updateSubject,
  getAllSubject,
  deleteSubject
} from "../controller/subjectController";

router.post("/:depId/reg", createSubject);
router.get("/fetch/:id", getSubject);
router.put("/update/:subId", updateSubject);
router.get("/fetchAll/:dep_id", getAllSubject);
router.delete("/delete-subject/:subject_id",deleteSubject);

export default router;
