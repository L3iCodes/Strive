import { ChevronDown, Mail, MailX, UserMinus } from 'lucide-react'
import type { Collaborators } from '../types'
import { useCollab } from '../hooks/useCollab';
import { useParams } from 'react-router-dom';
import { useAuthStore, type User } from '../store/useAuthStore';
import { useRef } from 'react';
import { useTask } from '../hooks/useTask';

interface CollaboratorCardProps {
    collaborator: Collaborators;
}



export const PendingCard = ({collaborator}: CollaboratorCardProps) => {
    const param  = useParams();
    const { inviteResponseMutation } = useCollab(param.id as string);
    const { userRole } = useAuthStore();

    return (
        <div className="p-2 flex items-center bg-base-300 gap-2 rounded-xs">
            <div className="w-9 h-9 flex justify-center items-center rounded-full bg-base-100 border-1 border-base-content/20">
                <Mail size={16} />
            </div>
            <div className="flex flex-col">
                <h3 className="text-[13px] font-medium ">{collaborator.user.email}</h3>
                <p className="text-xs text-base-content/50">Pending</p>
            </div>
            {userRole !== 'viewer'&& (
                <div className="ml-auto w-9 h-9 flex justify-center items-center rounded-full hover:bg-error hover:text-error-content active:bg-error/50 transition-all duration-150 cursor-pointer">
                    <MailX 
                        onClick={() => 
                        inviteResponseMutation.mutate(
                            { 
                                inviteId:collaborator.inviteId, 
                                action:'reject', 
                                message:'Cancelled an invite',
                                isSendResponse: false 
                            })} 
                        size={16} 
                    />
                </div>
            )}
        </div>
    );
};

export const CollaboratorCard = ({collaborator}: CollaboratorCardProps) => {
    const param = useParams();
    const dropDownRef = useRef<HTMLDetailsElement>(null);
    const { userRole } = useAuthStore();
    const { updateRoleMutation } = useCollab(param.id as string);
    const roles = ['viewer', 'editor'];

    return (
         <div className="p-2 flex items-center bg-base-300 gap-2 rounded-xs">
            <img 
                src={collaborator.user?.avatar || 'https://avatar.iran.liara.run/public'}
                className="w-8 h-8 rounded-full bg-base-100 border-2 border-base-content/20 object-cover"
            />
            <div className="flex flex-col">
                <h3 className="text-[13px] font-medium ">{collaborator.user.username}</h3>
                <p className="text-xs text-base-content/50">{collaborator.user.email}</p>
            </div>
            
            {userRole !== 'viewer' && (
                <details ref={dropDownRef} className="ml-auto relative">
                    <summary className={`w-full flex items-start justify-center gap-1 text-xs py-1 px-2 border-1 rounded-xs border-base-content/20 bg-base-100 cursor-pointer`}>
                        <p>{collaborator.role}</p>
                        <ChevronDown className="ml-auto" size={16} />
                    </summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-1 p-1 shadow-sm w-full text-xs border-1 border-base-content/10 absolute">
                        {roles.map(role => {
                            if(collaborator.role !== role) 
                                return (
                                    <li 
                                        key={role}
                                        onClick={() => {
                                            updateRoleMutation.mutate({boardId:param.id, collaboratorId:collaborator.user, role});
                                            dropDownRef.current?.removeAttribute("open");
                                        }} 
                                        className="font-medium border-b-1 border-base-content/10"
                                        ><a className={`flex flex-col gap-1 items-start`}>{role}</a>
                                    </li>
                                )
                        })}
                    </ul>
                </details>
            )}
        </div>
    )
};

interface CollaboratorAssignedCardProps {
    taskId: string;
    collaborator: User;
}
export const CollaboratorAssignedCard = ({taskId, collaborator}: CollaboratorAssignedCardProps) => {
    const param = useParams();
    const { removeAssigneekMutation } = useTask({ boardId:param.id, taskId:taskId })

    return(
        <div className=" w-full flex items-center gap-2 bg-base-200 p-2 rounded-xs ring-1 ring-base-content/10">
            <img 
                src={collaborator.avatar || 'https://avatar.iran.liara.run/public'}
                className="w-5 h-5 rounded-full bg-base-100 border-2 border-base-content/20 object-cover"
            />

            <h1 className="font-medium">{collaborator.username}</h1>
            <UserMinus 
                onClick={() => removeAssigneekMutation.mutate({taskId:taskId, assigneeId:collaborator._id as string, user:collaborator})}
                size={25} 
                className="text-base-content/50 ml-auto p-1 rounded-full cursor-pointer hover:text-error-content hover:bg-error active:bg-error/80 "
            />
        </div>
    )
};