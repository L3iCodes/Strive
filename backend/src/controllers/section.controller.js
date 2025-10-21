import { createSectionService } from "../services/section.service.js";
import Section from "../models/section.model.js";
import Board from "../models/board.model.js";
import { createActivityService } from "../services/activity.service.js";
import Task from "../models/task.model.js";

export const createSection = async (req, res) => {
    const { _id } = req.user;
    const { boardId, sectionName } = req.body;

    try{
        const newSection = await createSectionService(boardId, sectionName)
        // Log into board
        // await createActivityService(boardId, _id, `Created Section: [${newSection.name}]`)

        res.status(201).json(newSection);
    }catch(error){
        console.log('Error in createSectiion controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const deleteSection = async (req, res) => {
    const { _id } = req.user;
    const { sectionId } = req.params;

    try{
        const section = await Section.findByIdAndDelete(sectionId);
        if(!section){
            return res.status(404).json({ message: "Section not found" });
        };

        // Delete all tasks for the section
        await Task.deleteMany({ section: sectionId })

        // Remove from board
        await Board.findByIdAndUpdate(
            section.board,
            { $pull: { sections: section._id } },
            { new: true }
        );

        // await createActivityService(section.board, _id, `Deleted Section: [${section.name}]`)

        res.status(201).json(section);
    }catch(error){
        console.log('Error in deleteSection controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const updateSection = async (req, res) => {
    const { sectionId, sectionName } = req.body;
    
    try{
        const section = await Section.findByIdAndUpdate(
            sectionId,
            { $set: { name: sectionName.trim() === "" ? 'Section' : sectionName } },
            { new: true },
        );
        if(!section) return res.status(404).json({ message: "Section not found" });
        
        res.status(201).json(section);
    }catch(error){
        console.log('Error in deleteSection controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};