import express, { Router } from "express";
const router: Router = express.Router();
import {
  createEvent,
  deleteEvent,
  getAllEvent,
  getEvent,
  updateEvent,
  deleteAllEvent,
} from "../controller/eventController";

router.post("/create", createEvent);
router.get("/fetch/:id", getEvent);
router.put("/update-event/:id", updateEvent);
router.delete("/delete-event/:id", deleteEvent);
router.get("/fetchAll/:campusId", getAllEvent);
router.delete("/deleteAll", deleteAllEvent);
export default router;
