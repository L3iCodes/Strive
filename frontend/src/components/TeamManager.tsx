import { ChevronDown, Crown, Ellipsis, ListTodo, Mail, MailX, Plus, UserPlus, UserPlusIcon, Users, Users2, X } from "lucide-react";
import type { Collaborators } from "../types";


interface TeamManagerProps {
    isTeamManagerOpen: boolean;
    boardName: string | undefined;
    collaborators: Collaborators[] | undefined;
    closeTeamManager: () => void;
}

const TeamManager = ({boardName, collaborators, isTeamManagerOpen, closeTeamManager}: TeamManagerProps) => {
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
                <div className="flex flex-col gap-1 p-2 border-1 border-base-content/10">
                    <div>
                        <h2 className="text-[14px] font-medium flex items-center gap-2"><UserPlus size={16}/> Invite Team Members</h2>
                        <p className="text-xs text-base-content/50">Send invitations to collaborate on this board</p>
                    </div>
                    
                    <form>
                        <div className="flex items-center gap-2 mt-3">
                            <input 
                                type="text" 
                                placeholder="Enter email address" 
                                required={true}
                               
                                
                                className="input w-full h-fit p-2 rounded-xs border-1 border-base-content/20 bg-base-300/0 text-xs"
                                onChange={(e) => e.stopPropagation()}
                            />
                            <button 
                                type="submit"
                                
                                className="btn h-8 w-8 flex items-center justify-center p-1 bg-base-100 border-1 border-base-content/20 rounded-xs hover:bg-primary hover:text-primary-content active:bg-base-300 cursor-pointer">
                                    <Plus size={15}/>
                                </button>
                        </div>
                    </form>
                </div>

                <div className="flex flex-col gap-1 p-2 border-1 border-base-content/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Mail size={16}/>
                        <h2 className="text-[14px] font-medium ">Pending Invitations</h2>
                        <p className="text-[13px] w-5 h-5 bg-base-content/10 text-center rounded-xs">{collaborators?.length}</p>
                    </div>

                    {/* Pending Invitation */}
                    <div className="flex flex-col">
                        <div className="p-2 flex items-center bg-base-300 gap-2 rounded-xs">
                            <div className="w-9 h-9 flex justify-center items-center rounded-full bg-base-100 border-1 border-base-content/20">
                                <Mail size={16} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-[13px] font-medium ">janwilhelmtsy@gmail.com</h3>
                                <p className="text-xs text-base-content/50">Pending</p>
                            </div>

                            <div className="ml-auto w-9 h-9 flex justify-center items-center rounded-full hover:bg-error hover:text-error-content active:bg-error/50 transition-all duration-150 cursor-pointer">
                                <MailX size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1 p-2 border-1 border-base-content/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Users2 size={16}/>
                        <h2 className="text-[14px] font-medium ">Team Members</h2>
                        <p className="text-[13px] w-5 h-5 bg-base-content/10 text-center rounded-xs">{collaborators?.length}</p>
                    </div>

                    {/* Pending Invitation */}
                    <div className="flex flex-col gap-2">
                        
                        {/* Owner */}
                        <div className="p-2 flex items-center bg-base-300 gap-2 rounded-xs">
                            <div className="w-9 h-9 flex justify-center items-center rounded-full bg-base-100 border-1 border-base-content/20">
                                <Mail size={16} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-[13px] font-medium ">Jan Wilhelm T. Sy</h3>
                                <p className="text-xs text-base-content/50">janwilhelmtsy@gmail.com</p>
                            </div>
                            
                            <div className="ml-auto py-1 px-2 flex gap-1 items-center border-1 rounded-xs border-base-content/20 bg-base-100">
                                <Crown size={14} />
                                <p className="text-xs  ">Owner</p>
                            </div>
                        </div>

                        {/* Members */}
                        <div className="p-2 flex items-center bg-base-300 gap-2 rounded-xs">
                            <div className="w-9 h-9 flex justify-center items-center rounded-full bg-base-100 border-1 border-base-content/20">
                                <Mail size={16} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-[13px] font-medium ">Jane Doe</h3>
                                <p className="text-xs text-base-content/50">janedoe@gmail.com</p>
                            </div>
                            
                            <details className="ml-auto relative">
                                <summary className={`w-full flex items-start justify-center gap-1 text-xs py-1 px-2 border-1 rounded-xs border-base-content/20 bg-base-100 cursor-pointer`}>
                                    <p>viewer</p>
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
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TeamManager