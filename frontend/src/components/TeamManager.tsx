import { Crown, Mail, Users2, X } from "lucide-react";
import type { Collaborators } from "../types";
import type { User } from "../store/useAuthStore";
import InviteMemberForm from "./forms/InviteMemberForm";
import { CollaboratorCard, PendingCard } from "./CollboratorCard";

interface TeamManagerProps {
    isTeamManagerOpen: boolean;
    boardName: string | undefined;
    owner: User | undefined;
    collaborators: Collaborators[] | undefined;
    closeTeamManager: () => void;
}

const TeamManager = ({boardName, owner, collaborators, isTeamManagerOpen, closeTeamManager}: TeamManagerProps) => {
    return (
        <div className={`h-full pt-[75px] p-5 md:p-5 w-full max-w-md flex flex-col gap-3 fixed top-0 bg-base-100 border-1 border-base-content/20 shadow-xl/55 z-10 
                        transition-all duration-400 ease-in-out
                        ${isTeamManagerOpen ? 'right-0' : '-right-150'}`}
        >
            <div className="w-full h-fit p-2 flex border-b-1 items-center border-base-content/20 ">
                <div>
                    <h1 className="font-black">Team Management</h1>
                    <p className="text-xs text-base-content/50">{boardName}</p>
                </div>
                
                <div className="ml-auto flex gap-2">
                    <X onClick={closeTeamManager} className=" transition-all hover:scale-103 cursor-pointer" />
                </div>
            </div>

            <div className="flex flex-col gap-7">
                <InviteMemberForm />

                <div className="flex flex-col gap-1 p-2 border-1 border-base-content/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Mail size={16}/>
                        <h2 className="text-[14px] font-medium ">Pending Invitations</h2>
                        {/* <p className="text-[13px] w-5 h-5 bg-base-content/10 text-center rounded-xs">{collaborators?.length}</p> */}
                    </div>

                    {/* Pending Invitation */}
                    <div className="flex flex-col gap-2">
                        {collaborators
                            ?.filter(collaborator => collaborator.status === 'pending') // 1. Filter the collaborators array
                            .map(collaborator => (                                       // 2. Map the filtered array to components
                                <PendingCard 
                                    key={collaborator._id || collaborator.user._id}
                                    collaborator={collaborator}
                                />
                            ))
                        }
                    </div>
                </div>

                <div className="flex flex-col gap-1 p-2 border-1 border-base-content/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Users2 size={16}/>
                        <h2 className="text-[14px] font-medium ">Team Members</h2>
                        {/* <p className="text-[13px] w-5 h-5 bg-base-content/10 text-center rounded-xs">{collaborators?.length}</p> */}
                    </div>

                    {/* Members */}
                    <div className="flex flex-col gap-1">
                        
                        {/* Owner */}
                        <div className="p-2 flex items-center bg-base-300 gap-2 rounded-xs">
                            <img 
                                src={owner?.avatar || 'https://avatar.iran.liara.run/public'}
                                className="w-8 h-8 rounded-full bg-base-100 border-2 border-base-content/20 object-cover"
                            />
                            <div className="flex flex-col">
                                <h3 className="text-[13px] font-medium ">{owner?.username}</h3>
                                <p className="text-xs text-base-content/50">{owner?.email}</p>
                            </div>
                            
                            <div className="ml-auto py-1 px-2 flex gap-1 items-center border-1 rounded-xs border-base-content/20 bg-base-100">
                                <Crown size={14} />
                                <p className="text-xs  ">Owner</p>
                            </div>
                        </div>

                        {/* Members */}
                        <div className="flex flex-col gap-1">
                            {collaborators
                                ?.filter(collaborator => collaborator.status === 'accepted') // 1. Filter the collaborators array
                                .map(collaborator => (                                       // 2. Map the filtered array to components
                                    <CollaboratorCard 
                                        key={collaborator._id || collaborator.user._id}
                                        collaborator={collaborator}
                                    />
                                ))
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamManager


