"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supportTeamController_1 = require("../controller/supportTeamController");
const router = (0, express_1.Router)();
// router.post("/create", createSupportRequest);
// router.get("/", getSupportRequest);
// router.put("/:id", updateSupportRequest);
// router.get("/",getAllSupportRequests);
router.post("/create", supportTeamController_1.createSupport);
router.get("/filter", supportTeamController_1.getSupportRequestByfilter);
router.put("/update/:complaintNo", supportTeamController_1.updateSupport);
// router.post("/admin/support",createSupport)
exports.default = router;
