import type { User } from "../store/useAuthStore";
import type { BoardProps } from "./board.types";

export interface Collaborators{
    _id: string;
    user: User;
    role: 'viewer' | 'editor';
    status: 'pending' | 'accepted';
};

export interface InviteUserVariables {
    invitedUserEmail: string;
    boardId: string;
};

export interface InvitationVariables {
    from: User;
    to:  User;
    board:  BoardProps;
};