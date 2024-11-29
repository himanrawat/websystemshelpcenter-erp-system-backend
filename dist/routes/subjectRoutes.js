"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const subjectController_1 = require("../controller/subjectController");
router.post("/:depId/reg", subjectController_1.createSubject);
router.get("/fetch/:id", subjectController_1.getSubject);
router.put("/update/:subId", subjectController_1.updateSubject);
router.get("/fetchAll/:dep_id", subjectController_1.getAllSubject);
router.delete("/delete-subject/:subject_id", subjectController_1.deleteSubject);
exports.default = router;
