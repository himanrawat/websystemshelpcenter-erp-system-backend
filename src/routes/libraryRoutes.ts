import express, { Router } from "express";
const router: Router = express.Router();
import {
    createBook,
    deleteBookByTeacher,
    getAllBook,
    getAllBookByTeacher
} from "../controller/libraryController";

router.post("/create-book", createBook);
router.get("/fetch-books/:campusId", getAllBook)
router.get("/fetch-books-byTeacher/:teacher_id", getAllBookByTeacher);
router.delete("/delete-book/:teacher_id/:book_id", deleteBookByTeacher);
export default router;
