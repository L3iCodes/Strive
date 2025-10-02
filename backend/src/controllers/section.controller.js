import { createSectionService } from "../services/section.service.js";
import Section from "../models/section.model.js";
import Board from "../models/board.model.js";
import { createActivityService } from "../services/activity.service.js";

export const createSection = async (req, res) => {
    const { _id } = req.user;
    const { boardId, sectionName } = req.body;

    try{
        const newSection = await createSectionService(boardId, sectionName)
        // Log into board
        await createActivityService(boardId, _id, `Created Section: [${newSection.name}]`)

        res.status(201).json(newSection);
    }catch(error){
        console.log('Error in createSectiion controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const deleteSection = async (req, res) => {

};
