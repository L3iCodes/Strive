import mongoose from "mongoose";
import Board from "../models/board.model.js";
import User from "../models/user.model.js";
import { createActivityService } from "../services/activity.service.js";
import { createSectionService } from "../services/section.service.js";
import Section from "../models/section.model.js";
import Task from "../models/task.model.js";

export const getBoardList = async (req, res) => {
    const { _id } = req.user;

    try{
        const result = await User.aggregate([
            // Find the user
            { $match: { _id } },
            // Unwind boards array
            { $unwind: "$boards" },
            // Lookup board details
            {
                $lookup: {
                    from: "boards",
                    localField: "boards._id",
                    foreignField: "_id",
                    as: "board"
                }
            },
            { $unwind: "$board" },
            // **ADD THIS: Lookup sections with tasks**
            {
                $lookup: {
                    from: "sections",
                    localField: "board.sections",
                    foreignField: "_id",
                    as: "sectionsData"
                }
            },
            // Lookup collaborator avatars
            {
                $lookup: {
                    from: "users",
                    localField: "board.collaborators",
                    foreignField: "_id",
                    as: "collaborators"
                }
            },
            // Project fields
            {
                $project: {
                    _id: "$board._id",
                    name: "$board.name",
                    desc: "$board.desc",
                    owner: "$board.owner",
                    collaborators: {
                        $map: {
                            input: "$collaborators",
                            as: "c",
                            in: { _id: "$$c._id", avatar: "$$c.avatar" }
                        }
                    },
                    lastOpened: "$boards.lastOpened",
                    // total tasks - now using sectionsData
                    totalTasks: {
                        $sum: {
                            $map: {
                                input: "$sectionsData",
                                as: "section",
                                in: { $size: { $ifNull: ["$$section.tasks", []] } }
                            }
                        }
                    },
                    // done subtasks
                    doneTasks: {
                        $sum: {
                            $map: {
                                input: "$sectionsData",
                                as: "section",
                                in: {
                                    $sum: {
                                        $map: {
                                            input: { $ifNull: ["$$section.tasks", []] },
                                            as: "task",
                                            in: {
                                                $size: {
                                                    $ifNull: [
                                                        {
                                                            $filter: {
                                                                input: "$$task.checklist",
                                                                as: "item",
                                                                cond: { $eq: ["$$item.done", true] }
                                                            }
                                                        },
                                                        []
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]);

        res.status(201).json({ result });
    }catch(error){
        console.log('Error in getBoardList controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const createBoard = async (req, res) => {
    const { _id } = req.user;
    const { name, desc, sections } = req.body;
    try{
        const newBoard = await Board.create({
            name,
            desc,
            owner: _id,
            collaborators: [],
            sections: [],
            activities: [],
        });

        // Push new board to user
        await User.findByIdAndUpdate(
            _id,
            { 
                $push: {
                    boards: {_id: newBoard._id, lastOpened: new Date()}
                }
            },
            { new: true }
        );

        // // Optionally, create section along with the board
        if (sections && sections.length > 0){
            await Promise.all(
                sections.map(s => createSectionService(newBoard._id, s))
            );
        };

        // Store "created board" message in activity
        await createActivityService(newBoard._id, _id, "Created board");


        // // Sample return data
        // const populatedBoard = await Board.findById(newBoard._id)
        //     .populate("sections")
        //     .populate("activities");

        return res.status(201).json({newBoard});
    }catch(error){
        console.log('Error in createBoard controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const getKanbanBoard = async (req, res) => {
    const { id } = req.params;
    
    try{
        const board = await Board.findById(id)
            .populate('owner', '_id username avatar email')
            .populate({
                path: "collaborators.user",
                model: "User", 
                select: "username avatar email"
            })

            // Populate the sections (and tasks for each sections)
            .populate({
                path: 'sections',
                options: { sort: { createdAt: 1 } },
                populate: {
                    path: 'tasks',
                    populate: {
                        path: 'assignees',
                        select: '_id username email avatar'
                    }      
                }
            })

            // Populate the activity log
            .populate({
                path: 'activities',
                populate: {
                    path: 'user',
                    select: ('_id username email avatar')
                }
            });
        
        res.status(200).json({board});
    }catch(error){
        console.log('Error in getKanbanBoard controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const deleteBoard = async (req, res) => {
    const { boardId } = req.body;
    console.log('Deleting Board: ', boardId);

    try{
        const board = await Board.findById(boardId);
        if(!board){
            return res.status(404).json({message: "Board does not exists"});
        };

        // Delete sections
        await Section.deleteMany({ board: board._id });
        // Delete tasks
        await Task.deleteMany({ board: board._id });

        // Delete board for owner
        await User.findByIdAndUpdate(board.owner, { $pull: { boards: board._id }});
        // Delete board for all collaborators
        if(board.collaborators && board.collaborators.length > 0){
            await Promise.all(
                board.collaborators.map( async (collaborator) => {
                    await User.findByIdAndUpdate(collaborator.user._id, {  $pull: { boards: board._id } });
                })
            ) ;
        };

        // Delete the board
        await Board.findByIdAndDelete(board._id);

        return res.status(200).json(board);
    }catch(error){
        console.log('Error in deleteBoard controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};