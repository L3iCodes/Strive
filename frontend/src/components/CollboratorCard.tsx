import { ChevronDown, Mail, MailX } from 'lucide-react'
import type { Collaborators } from '../types'
import { useCollab } from '../hooks/useCollab';
import { useParams } from 'react-router-dom';

interface CollaboratorCardProps {
    collaborator: Collaborators;
}

export const PendingCard = ({collaborator}: CollaboratorCardProps) => {
    const param  = useParams();
    const { inviteResponseMutation } = useCollab(param.id as string);

    return (
        <div className="p-2 flex items-center bg-base-300 gap-2 rounded-xs">
            <div className="w-9 h-9 flex justify-center items-center rounded-full bg-base-100 border-1 border-base-content/20">
                <Mail size={16} />
            </div>
            <div className="flex flex-col">
                <h3 className="text-[13px] font-medium ">{collaborator.user.email}</h3>
                <p className="text-xs text-base-content/50">Pending</p>
            </div>
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
        </div>
    );
};

export const CollaboratorCard = ({collaborator}: CollaboratorCardProps) => {
    return (
         <div className="p-2 flex items-center bg-base-300 gap-2 rounded-xs">
            <div className="w-9 h-9 flex justify-center items-center rounded-full bg-base-100 border-1 border-base-content/20">
                <Mail size={16} />
            </div>
            <div className="flex flex-col">
                <h3 className="text-[13px] font-medium ">{collaborator.user.username}</h3>
                <p className="text-xs text-base-content/50">{collaborator.user.email}</p>
            </div>
            
            <details className="ml-auto relative">
                <summary className={`w-full flex items-start justify-center gap-1 text-xs py-1 px-2 border-1 rounded-xs border-base-content/20 bg-base-100 cursor-pointer`}>
                    <p>{collaborator.role}</p>
                    <ChevronDown className="ml-auto" size={16} />
                </summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 p-1 shadow-sm w-full text-xs border-1 border-base-content/10 absolute">
                    <li 
                        // onClick={() => {setTaskData({...taskData, priority: choice}), dropDownRef.current?.removeAttribute("open");}} 
                        className="font-medium border-b-1 border-base-content/10"
                        ><a className={`flex flex-col gap-1 items-start`}>viewer</a>
                    </li>

                    <li 
                        // onClick={() => {setTaskData({...taskData, priority: choice}), dropDownRef.current?.removeAttribute("open");}} 
                        className="font-medium border-b-1 border-base-content/10"
                        ><a className={`flex flex-col gap-1 items-start`}>editor</a>
                    </li>
                </ul>
            </details>
        </div>
    )
};

