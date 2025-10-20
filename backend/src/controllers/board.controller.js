import mongoose from "mongoose";
import Board from "../models/board.model.js";
import User from "../models/user.model.js";
import { createActivityService } from "../services/activity.service.js";
import { createSectionService } from "../services/section.service.js";
import Section from "../models/section.model.js";
import Task from "../models/task.model.js";
import Activity from "../models/activity.model.js";
import { findBoardAndPopulate } from "../services/board.service.js";

export const getBoardList = async (req, res) => {
    const { _id } = req.user;

    try{
        const result = await User.aggregate([
            // 1. Find the user
            { $match: { _id: _id } },
            
            // 2. Unwind the boards array to work with one board at a time
            { $unwind: "$boards" },
            
            // 3. Lookup Board details (The core Board Document)
            {
                $lookup: {
                    from: "boards",
                    localField: "boards._id",
                    foreignField: "_id",
                    as: "board"
                }
            },
            { $unwind: "$board" },
            
            // 4. Lookup Sections (Fetching the array of Section IDs from the Board)
            {
                $lookup: {
                    from: "sections",
                    localField: "board.sections",
                    foreignField: "_id",
                    as: "sectionsData"
                }
            },
            
            // 5. Unwind Sections to process all tasks across all sections
            { $unwind: { path: "$sectionsData", preserveNullAndEmptyArrays: true } },
            
            // 6. Lookup ALL Tasks belonging to the current Section
            {
                $lookup: {
                    from: "tasks", // Assuming your task collection is 'tasks'
                    localField: "sectionsData.tasks",
                    foreignField: "_id",
                    as: "sectionTasks" // Array of actual Task documents
                }
            },
            
            // 7. Unwind the Tasks array to calculate checklist metrics
            { $unwind: { path: "$sectionTasks", preserveNullAndEmptyArrays: true } },
            
            
            // 8. Group by Board ID to consolidate the counts across all tasks/sections
            {
                $group: {
                    _id: "$board._id",
                    name: { $first: "$board.name" },
                    desc: { $first: "$board.desc" },
                    owner: { $first: "$board.owner" },
                    collaboratorsArray: { $first: "$board.collaborators" }, // Store collaborators array
                    lastOpened: { $first: "$boards.lastOpened" },
                    
                    // Total Tasks: Count the number of actual Task documents processed
                    totalTasks: { 
                        $sum: { $cond: [{ $ifNull: ["$sectionTasks._id", false] }, 1, 0] } 
                    },
                    
                    // Done Tasks: Sum the calculated completed items from the $addFields stage
                    doneTasks: { 
                        $sum: {
                            $cond: [
                                { $eq: ["$sectionTasks.done", true] }, // Check if the task's 'done' field is true
                                1, // If true, count 1
                                0  // If false or missing, count 0
                            ]
                        }
                    }
                }
            },
            
            // 9. Lookup Collaborator Avatars (Using the stored collaboratorsArray from $group)
            {
                $lookup: {
                    from: "users",
                    localField: "collaboratorsArray.user", 
                    foreignField: "_id",
                    as: "collaboratorUsers"
                }
            },

            // 10. Add computed field to merge collaborator metadata with user data
            {
                $addFields: {
                    collaborators: {
                        $map: {
                            input: "$collaboratorsArray",
                            as: "collab",
                            in: {
                                $mergeObjects: [
                                    // Get the user data
                                    {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$collaboratorUsers",
                                                    as: "user",
                                                    cond: { $eq: ["$$user._id", "$$collab.user"] }
                                                }
                                            },
                                            0
                                        ]
                                    },
                                    // Add the status and role from collaboratorsArray
                                    {
                                        status: "$$collab.status",
                                        role: "$$collab.role",
                                        inviteId: "$$collab.inviteId"
                                    }
                                ]
                            }
                        }
                    }
                }
            },

            // 11. Final Projection (Structuring the final output)
            {
                $project: {
                    _id: 1,
                    name: 1,
                    desc: 1,
                    owner: 1,
                    lastOpened: 1,
                    totalTasks: 1,
                    doneTasks: 1,
                    collaborators: {
                        $map: {
                            input: "$collaborators",
                            as: "c",
                            in: { 
                                _id: "$$c._id", 
                                avatar: "$$c.avatar",
                                status: "$$c.status",      // Now included
                                role: "$$c.role",          // Now included
                                inviteId: "$$c.inviteId"   // Optional: if you need it
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
            collaborators: [
                {
                    user: _id,
                    status: 'accepted',
                    role: 'owner',
                }
            ],
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

        return res.status(201).json(newBoard);
    }catch(error){
        console.log('Error in createBoard controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const getKanbanBoard = async (req, res) => {
    const { id } = req.params;
    
    try{
        const board = await findBoardAndPopulate(id);
        if (!board) return res.status(404).json({ message: "Error fetching updated board" });

        res.status(200).json({board});
    }catch(error){
        console.log('Error in getKanbanBoard controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const deleteBoard = async (req, res) => {
    const { boardId } = req.params;

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
        await User.findByIdAndUpdate(board.owner, { $pull: { boards: { _id: board._id } }});
        // Delete board for all collaborators
        if(board.collaborators && board.collaborators.length > 0){
            await Promise.all(
                board.collaborators.map( async (collaborator) => {
                    await User.findByIdAndUpdate(collaborator.user._id, {  $pull: { boards: { _id: board._id } } });
                })
            ) ;
        };

        //Delete activities
        await Activity.deleteMany({ board: board._id });

        // Delete the board
        await Board.findByIdAndDelete(board._id);

        return res.status(200).json(board);
    }catch(error){
        console.log('Error in deleteBoard controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const updateLastOpened = async (req, res) => {
    const { _id } = req.user;
    const { boardId } = req.body;
     
    try{
        const user = await User.findOneAndUpdate(
            {
                _id: _id,
                'boards._id': boardId
            },
            {
                $set: {'boards.$.lastOpened': Date.now()}
            },
            { new: true }
        );
        if(!user) return res.status(404).json({message: "User does not exists"});

        return res.status(200).json({ message: "Last opened updated successfully" })
    }catch(error){
        console.log('Error in deleteBoard controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
}