import { Plus, UserPlus } from "lucide-react"
import { useParams } from "react-router-dom";
import { useCollab } from "../../hooks/useCollab";
import type React from "react";
import { useState } from "react";

const InviteMemberForm = () => {
    const param = useParams();
    const [email, setEmail] = useState('');
    const { inviteUserMutation } = useCollab(param.id as string);

    const handleInvite = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        inviteUserMutation.mutate(
            {invitedUserEmail: email, boardId:param.id as string},
            { onSuccess: () => setEmail('') }
        );
    };

    return (
        <form onSubmit={handleInvite} className="flex flex-col gap-1 p-2 border-1 border-base-content/10">
            <div>
                <h2 className="text-[14px] font-medium flex items-center gap-2"><UserPlus size={16}/> Invite Team Members</h2>
                <p className="text-xs text-base-content/50">Send invitations to collaborate on this board</p>
            </div>
            
            <div>
                <div className="flex items-center gap-2 mt-3">
                    <input 
                        type="email" 
                        placeholder="Enter email address" 
                        required={true}
                        value={email}
                        disabled={inviteUserMutation.isPending}
                        className="input w-full h-fit p-2 rounded-xs border-1 border-base-content/20 bg-base-300/0 text-xs"
                        onChange={(e) => setEmail(e.currentTarget.value)}
                    />
                    <button 
                        type="submit"
                        disabled={inviteUserMutation.isPending}
                        className="btn h-8 w-8 flex items-center justify-center p-1 bg-base-100 border-1 border-base-content/20 rounded-xs hover:bg-primary hover:text-primary-content active:bg-base-300 cursor-pointer">
                            <Plus size={15}/>
                        </button>
                </div>
            </div>
        </form>
    );
};

export default InviteMemberForm
