"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllEvent = exports.deleteEvent = exports.updateEvent = exports.getAllEvent = exports.getEvent = exports.createEvent = void 0;
const db_config_1 = __importDefault(require("../db/db.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, date, photo, campusId } = req.body;
    try {
        const newEvent = yield db_config_1.default.event.create({
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
});
exports.createEvent = createEvent;
const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const isEvent = yield db_config_1.default.event.findFirst({
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
});
exports.getEvent = getEvent;
const getAllEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const campusId = parseInt(req.params.campusId);
    try {
        const events = yield db_config_1.default.event.findMany({
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
});
exports.getAllEvent = getAllEvent;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { title, description, date, photo } = req.body;
    try {
        const isEvent = yield db_config_1.default.event.findFirst({
            where: {
                id: id,
            },
        });
        if (!isEvent)
            return res.status(404).json({ message: "Event does not exist!" });
        const updatedEvent = yield db_config_1.default.event.update({
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
});
exports.updateEvent = updateEvent;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const eventExist = yield db_config_1.default.event.findFirst({
            where: {
                id: id,
            },
        });
        if (!eventExist)
            return res.status(404).json({ message: "Event does not exist!" });
        yield db_config_1.default.event.delete({
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
});
exports.deleteEvent = deleteEvent;
const deleteAllEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_config_1.default.event.deleteMany({});
        return res.status(200).json({ message: "Events deleted successfully!" });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try after some time." });
    }
});
exports.deleteAllEvent = deleteAllEvent;
