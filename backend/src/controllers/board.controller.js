import mongoose from "mongoose";
import Board from "../models/board.model.js";
import User from "../models/user.model.js";
import { createActivityService } from "../services/activity.service.js";
import { createSectionService } from "../services/section.service.js";

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

                    // total tasks
                    totalTasks: {
                    $sum: {
                        $map: {
                        input: "$board.sections",
                        as: "section",
                        in: { $size: { $ifNull: ["$$section.tasks", []] } }
                        }
                    }
                    },

                    // done subtasks
                    doneTasks: {
                    $sum: {
                        $map: {
                        input: "$board.sections",
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
            // .populate({
            //     path: 'sections',
            //     populate: {
            //         path: 'tasks',
            //         populate: {
            //             path: 'assignees',
            //             select: '_id username email avatar'
            //         }      
            //     }
            // })
            .populate('sections')

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