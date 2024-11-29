"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const leaveController_1 = require("../controller/leaveController");
router.post("/apply-leave", leaveController_1.applyLeave);
router.get("/fetch-leaves/:teacher_id", leaveController_1.fetchAllLeaves);
router.get("/pending-leaves", leaveController_1.fetchAllLeavesInCampus);
router.put("/change-status/:teacherId/:newStatus", leaveController_1.changeStatus);
exports.default = router;
