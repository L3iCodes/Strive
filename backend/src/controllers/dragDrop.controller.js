import Board from "../models/board.model.js";
import Task from "../models/task.model.js";
import Section from "../models/section.model.js";
import { findBoardAndPopulate } from "../services/board.service.js";

export const reorderSection = async (req, res) => {
    const { boardId, newSectionOrder } = req.body;

    try{
        const sectionOrderId = newSectionOrder.map(section => section._id);

        const updateResult = await Board.findByIdAndUpdate(
            boardId,
            { $set: { sections: sectionOrderId } },
            { new: true }
        );
        if(!updateResult) return res.status(404).json({ message: "Board not found" });

        const board = await findBoardAndPopulate(boardId);
        if (!board) return res.status(404).json({ message: "Error fetching updated board" });
        
        return res.status(201).json(board);
     }catch(error){
        console.log('Error in reorderSection controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const dragTask = async (req, res) => {
    const { taskId, sourceSectionId, targetSectionId, taskOrder } = req.body;

    try{
        // Find and update task's section
        const task = await Task.findByIdAndUpdate(
            taskId,
            { $set: { section: targetSectionId } },
            { new: true }
        );
        if(!task) return res.status(404).json({ message: "Task not found" });

        // Remove task from source section
        await Section.findByIdAndUpdate(
            sourceSectionId,
            { $pull: { tasks: task._id } }
        );

        // Update task order of the target section
        await Section.findByIdAndUpdate(
            targetSectionId,
            { $set: { tasks: taskOrder.map(task => task._id) } }
        );

        return res.status(201).json({message: "Task succesfully dragged"});
        
     }catch(error){
        console.log('Error in dragTask controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};