"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const libraryController_1 = require("../controller/libraryController");
router.post("/create-book", libraryController_1.createBook);
router.get("/fetch-books/:campusId", libraryController_1.getAllBook);
router.get("/fetch-books-byTeacher/:teacher_id", libraryController_1.getAllBookByTeacher);
router.delete("/delete-book/:teacher_id/:book_id", libraryController_1.deleteBookByTeacher);
exports.default = router;
