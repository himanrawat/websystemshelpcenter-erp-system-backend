import { Router } from "express";
import { verifyToken } from "../middleware/auth";
import { adminExist } from "../middleware/adminExist";
import { 
    createResults,
    updateFullResult,
    updateResultPartial,
    getAllResults, 
    getResultById, 
    deleteResults, 
    deleteResultPartial 
 } from "../controller/resultController";

const router = Router();

router.post("/campus/:campusId/reg", adminExist, createResults);
router.put("/campus/:campusId/:studentId", adminExist, updateFullResult);
router.patch('/campus/:campusId/:studentId/:subjectId', adminExist, updateResultPartial);
router.get("/campus/:campusId/results", adminExist, getAllResults);
router.delete("/campus/:campusId/:studentId", adminExist, deleteResults);
router.delete("/campus/:campusId/:resultId", adminExist, deleteResultPartial);
router.get("/campus/student/:studentId", getResultById);

export default router;


