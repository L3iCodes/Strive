import Activity from "../models/activity.model.js";
import Board from "../models/board.model.js";

export const createActivityService = async (boardId, userId, action) => {

    const newActivity = await Activity.create({
        board: boardId,
        user: userId,
        action
    });

    // Push to board
    await Board.findByIdAndUpdate(
        boardId,
        { $push: { activities: newActivity._id } }
    );

    return newActivity;
};