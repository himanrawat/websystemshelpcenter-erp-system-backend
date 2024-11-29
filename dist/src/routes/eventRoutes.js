"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const eventController_1 = require("../controller/eventController");
router.post("/create", eventController_1.createEvent);
router.get("/fetch/:id", eventController_1.getEvent);
router.put("/update-event/:id", eventController_1.updateEvent);
router.delete("/delete-event/:id", eventController_1.deleteEvent);
router.get("/fetchAll/:campusId", eventController_1.getAllEvent);
router.delete("/deleteAll", eventController_1.deleteAllEvent);
exports.default = router;
