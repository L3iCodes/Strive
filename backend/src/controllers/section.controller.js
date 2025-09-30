import { createSectionService } from "../services/section.service.js";

export const createSection = async (req, res) => {
    const {boardId, sectionName} = req.body;

    try{
        const newSection = createSectionService(boardId, sectionName)
        res.status(201).json({newSection});
    }catch(error){
        console.log('Error in createSectiion controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};