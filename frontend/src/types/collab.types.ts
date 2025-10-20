import type { User } from "../store/useAuthStore";
import type { BoardProps } from "./board.types";

export interface Collaborators{
    _id: string;
    inviteId: string;
    user: User;
    role: 'viewer' | 'editor' | 'owner';
    status: 'pending' | 'accepted';
};

export interface InviteUserVariables {
    invitedUserEmail: string;
    boardId: string;
};

export interface InvitationVariables {
    inviteId: string;
    from: User;
    to:  User;
    board:  BoardProps;
    type: 'message' | 'invite';
    message: string;
};