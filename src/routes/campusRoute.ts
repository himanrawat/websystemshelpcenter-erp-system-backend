import express, { Router } from "express";
const router: Router = express.Router();
import {
    getAllCampus,
    createCampus,
    createBranch,
    deleteBranch,
    updateCampus,
    getCampusById,
    getCampusByname
} from "../controller/campusController";

// router.post("/create-campus", createCampus);
router.get("/fetch-campus", getAllCampus);
router.post("/fetch-campus/name", getCampusByname);
router.post("/reg/campus", createCampus);
router.post("/reg/branch", createBranch);
router.put("/update-campus", updateCampus);
router.get("/fetch-campus/:id", getCampusById);
// router.put("/update-campus/:id", updateCampus);
router.delete("/reg/branch/delete", deleteBranch);

export default router;
