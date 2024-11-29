"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminExist = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const adminExist = async (req, res, next) => {
    try {
        const adminId = req.params.campusId;
        if (!adminId)
            return res.status(400).json({ message: "Please provide a admin id." });
        const isAdmin = await db_config_1.default.admin.findUnique({
            where: {
                id: parseInt(adminId),
            },
        });
        if (!isAdmin)
            return res.status(404).json({ message: "admin does not exist." });
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
exports.adminExist = adminExist;
