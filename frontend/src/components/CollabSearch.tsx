import { Search } from "lucide-react"
import type { User } from "../store/useAuthStore";
import { useBoard } from "../hooks/useBoard";
import { useParams } from "react-router-dom";
import React, { useState } from "react";

interface CollabSearchProps{
    assignees: User[] | undefined
}

const CollabSearch = ({assignees}:CollabSearchProps) => {
    const param = useParams();
    const { kanban:board } = useBoard(param.id as string);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCollaborators, setFilteredCollaborators] = useState(() => {
        // Create assignees list for comparison
        const assignedIds = new Set(
            assignees?.map(assignee => assignee._id?.toString())
        );

        // Remove collaborators that are already assigned to the task
        const filteredCollaborators = board?.collaborators
        ? board.collaborators.filter(collaborator => {
            const collaboratorId = collaborator.user._id?.toString();
            
            // Return true only if the ID is NOT in the assignedIds Set
            return !assignedIds.has(collaboratorId);
        })
        : [];

        return filteredCollaborators
    });

    return (
            <div className="w-[250px] p-2 flex flex-col gap-2 bg-base-200  border-1 border-base-content/10 rounded-xs shadow-xl z-10 absolute top-10">
                <div className="w-full flex gap-1 border-b-1 border-base-content/10 py-1">
                    <Search size={15}/>
                    <input 
                        type="text" 
                        placeholder="Search"
                        className="w-full"
                        onChange={(e) => setSearchTerm(e.currentTarget.value)}
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    {filteredCollaborators
                        .filter(collaborator => {
                            const email = collaborator.user.email?.toLowerCase() || '';
                            const username = collaborator.user.username?.toLowerCase() || '';
                            const term = searchTerm.toLowerCase();

                            // The filter must return a boolean: true to keep the element, false to discard
                            return email.includes(term) || username.includes(term);
                        })
                        .map(collaborator => (
                            <div 
                                key={collaborator.user._id} 
                                className="w-full flex gap-2 cursor-pointer border-1 border-base-content/0 hover:bg-base-300 hover:border-base-content/10 p-1"
                            >
                                <img 
                                    src={collaborator.user?.avatar || 'https://avatar.iran.liara.run/public'}
                                    alt={`${collaborator.user.username}'s avatar`}
                                    className="w-8 h-8 rounded-full bg-base-100 border-2 border-base-content/20 object-cover"
                                />

                                <div>
                                    <h1 className="text-[13px] font-medium">{collaborator.user.username}</h1>
                                    <p className=" text-xs text-base-content/50">{collaborator.user.email}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
    )
}

export default CollabSearch
