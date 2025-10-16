import Board from "../models/board.model.js";
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