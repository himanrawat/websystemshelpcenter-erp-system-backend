"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const departmentController_1 = require("../controller/departmentController");
router.post("/:campusId/reg", departmentController_1.createDepartment);
router.get("/fetch/:dep_id", departmentController_1.getDepartment);
router.get("/fetchAll/:campusId", departmentController_1.getAllDepartment);
router.delete("/delete/:id", departmentController_1.deleteDepartment);
router.put("/update/:depId", departmentController_1.updateDepartment);
exports.default = router;
