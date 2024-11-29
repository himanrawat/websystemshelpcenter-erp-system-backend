import prisma from "../db/db.config";
import { Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();

export const createEvent = async (req: Request, res: Response) => {
  const { title, description, date,photo,campusId } = req.body;
  try {
    const newEvent = await prisma.event.create({
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
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong! Please try after some time." });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  try {
    const isEvent = await prisma.event.findFirst({
      where: {
        id: id, 
      },
    });
    if (!isEvent)
      return res.status(404).json({ message: "Event does not exist!" });
    return res
      .status(200)
      .json({ message: "Event fetched successfully!", data: isEvent });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong! Please try after some time." });
  }
};

export const getAllEvent = async (req: Request, res: Response) => {
  const campusId:number=parseInt(req.params.campusId);
  try {
    const events = await prisma.event.findMany({
      where:{
        campusId:campusId
      }
    });
    if (events.length === 0)
      return res.status(404).json({ message: "Event does not exist!" });
    return res
      .status(200)
      .json({ message: "Event fetched successfully!", data: events });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong! Please try after some time." });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const { title, description, date,photo } = req.body;
  try {
    const isEvent = await prisma.event.findFirst({
      where: {
        id: id,
      },
    });
    if (!isEvent)
      return res.status(404).json({ message: "Event does not exist!" });
    const updatedEvent = await prisma.event.update({
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
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong! Please try after some time." });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  try {
    const eventExist = await prisma.event.findFirst({
      where: {
        id: id,
      },
    });
    if (!eventExist)
      return res.status(404).json({ message: "Event does not exist!" });
    await prisma.event.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong! Please try after some time." });
  }
};

export const deleteAllEvent = async (req: Request, res: Response) => {
  try {
    await prisma.event.deleteMany({});
    return res.status(200).json({ message: "Events deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong! Please try after some time." });
  }
};
