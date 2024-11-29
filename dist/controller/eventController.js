"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllEvent = exports.deleteEvent = exports.updateEvent = exports.getAllEvent = exports.getEvent = exports.createEvent = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createEvent = async (req, res) => {
    const { title, description, date, photo, campusId } = req.body;
    try {
        const newEvent = await db_config_1.default.event.create({
            data: {
                title,
                description,
                date,
                photo,
                campusId
            },
        });
        return res
            .status(201)
            .json({ message: "Event created successfully!", data: newEvent });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try after some time." });
    }
};
exports.createEvent = createEvent;
const getEvent = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const isEvent = await db_config_1.default.event.findFirst({
            where: {
                id: id,
            },
        });
        if (!isEvent)
            return res.status(404).json({ message: "Event does not exist!" });
        return res
            .status(200)
            .json({ message: "Event fetched successfully!", data: isEvent });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try after some time." });
    }
};
exports.getEvent = getEvent;
const getAllEvent = async (req, res) => {
    const campusId = parseInt(req.params.campusId);
    try {
        const events = await db_config_1.default.event.findMany({
            where: {
                campusId: campusId
            }
        });
        if (events.length === 0)
            return res.status(404).json({ message: "Event does not exist!" });
        return res
            .status(200)
            .json({ message: "Event fetched successfully!", data: events });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try after some time." });
    }
};
exports.getAllEvent = getAllEvent;
const updateEvent = async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description, date, photo } = req.body;
    try {
        const isEvent = await db_config_1.default.event.findFirst({
            where: {
                id: id,
            },
        });
        if (!isEvent)
            return res.status(404).json({ message: "Event does not exist!" });
        const updatedEvent = await db_config_1.default.event.update({
            where: {
                id: id,
            },
            data: {
                title: title,
                description: description,
                date: date,
                photo,
            },
        });
        return res
            .status(202)
            .json({ message: "Event updated successfully!", data: updatedEvent });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try after some time." });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const eventExist = await db_config_1.default.event.findFirst({
            where: {
                id: id,
            },
        });
        if (!eventExist)
            return res.status(404).json({ message: "Event does not exist!" });
        await db_config_1.default.event.delete({
            where: {
                id: id,
            },
        });
        return res.status(200).json({ message: "Event deleted successfully!" });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try after some time." });
    }
};
exports.deleteEvent = deleteEvent;
const deleteAllEvent = async (req, res) => {
    try {
        await db_config_1.default.event.deleteMany({});
        return res.status(200).json({ message: "Events deleted successfully!" });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try after some time." });
    }
};
exports.deleteAllEvent = deleteAllEvent;
