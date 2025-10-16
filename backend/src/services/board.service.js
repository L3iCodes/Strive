import Board from "../models/board.model.js";

export const findBoardAndPopulate = async (boardId) => {
    return await Board.findById(boardId)
        .populate('owner', '_id username avatar email')
        .populate({
            path: "collaborators.user",
            model: "User", 
            select: "username avatar email"
        })
        .populate({
            path: 'sections',
            populate: {
                path: 'tasks',
                populate: {
                    path: 'assignees',
                    select: '_id username email avatar'
                }      
            }
        })
        .populate({
            path: 'activities',
            populate: {
                path: 'user',
                select: ('_id username email avatar')
            }
        });
};