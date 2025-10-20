import User from "../models/user.model.js";
import Board from "../models/board.model.js";
import Notification from "../models/notification.model.js";

export const getInvites = async (req, res) => {
    const { _id } = req.user;

    try{
        // Get board invites
        const invites = await Notification.find({ to: _id })
            .sort({ createdAt: -1 })
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
        const invitation = await Notification.create({
            from: _id,
            to: invitedUser._id,
            board: boardId,
            type: 'invite',
            message: 'Has invited you to collaborate in',
        });

        const newCollaborator = {
            inviteId: invitation._id,
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

export const inviteResponse = async (req, res) => {
    const { inviteId, action, message, isSendResponse=true } = req.body;

    try{
        const invitation = await Notification.findById(inviteId);
        if(!invitation) {
            await Notification.findByIdAndDelete(inviteId);
            return res.status(404).json({message: "Invitation does not exists"});
        };

        if(action === 'accept'){
            // Update board collaborator status
            await Board.findOneAndUpdate(
                {
                    _id: invitation.board,
                    'collaborators.user': invitation.to,
                },
                {
                    $set: { 'collaborators.$.status': 'accepted' }
                },
                { new: true },
            );

            await User.findByIdAndUpdate(
                invitation.to,
                { $push: { boards: { _id:invitation.board, lastOpened: Date.now() } }},
                { new: true } 
            )
            
            await Notification.findByIdAndDelete(inviteId);

            // Return response
            await Notification.create({
                from: invitation.to,
                to: invitation.from,
                board: invitation.board,
                type: 'message',
                message: message || 'Has accepted your invite.',
            });
        };

        if(action === 'reject'){
            // Remove the user from the collaborator field
            await Board.findOneAndUpdate(
                {
                    _id: invitation.board,
                    'collaborators.user': invitation.to,
                },
                {
                    $pull: { collaborators: { user: invitation.to } }
                },
                { new: true }
            );

            await Notification.findByIdAndDelete(inviteId);

            if(isSendResponse){
                // Return response
                await Notification.create({
                    from: invitation.to,
                    to: invitation.from,
                    board: invitation.board,
                    type: 'message',
                    message: message || 'Has rejected your invite.',
                });
            } 
        };

        return res.status(201).json({ message: 'User responded to invitation' });
    }catch(error){
        console.log('Error in inviteAction controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const deleteNotification = async (req, res) => {
    const { inviteId } = req.body;

    try{
        const invitation = await Notification.findByIdAndDelete(inviteId);
        if(!invitation) return res.status(404).json({message: "Invitation does not exists"});

        return res.status(201).json({ message: 'Notification deleted' });
    }catch(error){
        console.log('Error in inviteAction controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const updateRole = async (req, res) => {
    const { _id } = req.user;
    const { boardId, collaboratorId, role } = req.body;

    try{
        //Find and update the board & collaborator
        const board = await Board.findOneAndUpdate(
            {
                _id: boardId,
                'collaborators.user': collaboratorId,
            },
            {
                $set: { 'collaborators.$.role': role } 
            }
        )
        if(!board) return res.status(404).json({message: "Board does not exists"});

        // Send notification for permission change
        await Notification.create({
            from: _id,
            to: collaboratorId,
            board: boardId,
            type: 'message',
            message: `Has changed your permission in [${board.name}] to ${role} `,
        });

        return res.status(201).json({ message: 'Collaborator role updated' });
    }catch(error){
        console.log('Error in editPermission controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
}