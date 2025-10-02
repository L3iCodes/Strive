import Section from "../models/section.model.js";
import Board from "../models/board.model.js";

export const createSectionService = async (boardId, sectionName) => {
    const newSection = await Section.create({
        name: sectionName.trim() === "" ? 'New Task' : sectionName,
        board: boardId,
        tasks: []
    })
    // Push to board
    await Board.findByIdAndUpdate(
        boardId, 
        { $push: { sections: newSection._id } 
    });

    return newSection;
};