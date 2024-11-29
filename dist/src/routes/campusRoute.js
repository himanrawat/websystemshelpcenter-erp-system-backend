"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const campusController_1 = require("../controller/campusController");
// router.post("/create-campus", createCampus);
router.get("/fetch-campus", campusController_1.getAllCampus);
router.post("/fetch-campus/name", campusController_1.getCampusByname);
router.post("/reg/campus", campusController_1.createCampus);
router.post("/reg/branch", campusController_1.createBranch);
router.put("/update-campus", campusController_1.updateCampus);
router.get("/fetch-campus/:id", campusController_1.getCampusById);
// router.put("/update-campus/:id", updateCampus);
router.delete("/reg/branch/delete", campusController_1.deleteBranch);
exports.default = router;
