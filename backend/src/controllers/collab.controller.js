import User from "../models/user.model.js";
import Board from "../models/board.model.js";
import Invite from "../models/invite.model.js";

export const getInvites = async (req, res) => {
    const { _id } = req.user;

    try{
        // Get board invites
        const invites = await Invite.find({ to: _id })
            .populate('from', 'username email avatar') // Populate the 'from' field, selecting only 'username' and 'email' fields
            .populate('to', 'username email avatar')
            .populate('board', 'name')   
            .exec(); // execute the query

        return res.status(200).json(invites)
    }catch(error){
        console.log('Error in getInvites controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const inviteUser = async (req, res) => {
    const { _id } = req.user;
    const { invitedUserEmail, boardId } = req.body;

    try{
        // Find invited user
        const invitedUser = await User.findOne({ email: invitedUserEmail })
        if(!invitedUser) return res.status(404).json({message: "User does not exists"});
        
        // Check if user is already in the board
        const userInBoard = await Board.findOne({
            _id: boardId,
            'collaborators.user': invitedUser._id
        });
        if(userInBoard) return res.status(404).json({message: "User was already invited or collaborating already"});
        
        // Invite user
        await Invite.create({
            from: _id,
            to: invitedUser._id,
            board: boardId
        });

        const newCollaborator = {
            user: invitedUser._id,
            status: 'pending',
            role: 'viewer'
        };

        // Store pending user in collaborator field
        const board = await Board.findByIdAndUpdate(
            boardId,
            { $push: { collaborators: newCollaborator } },
            { new: true },
        );

        return res.status(201).json(board);
    }catch(error){
        console.log('Error in inviteUser controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};