import { Ellipsis } from "lucide-react"
import type { Collaborators } from "../types";

interface BoardHeaderProps{
    name: string;
    collaborators: Collaborators[];
    openManage: () => void;
}

export const BoardHeader = ({name, collaborators, openManage}: BoardHeaderProps) => {
    return (
        <div className="w-full flex items-center p-1 border-1 border-base-content/10 h-10">
            <div className="flex flex-col">
                <h1 className="font-bold ml-1">{name}</h1>
            </div>
            <div className="flex ml-auto items-center gap-1">
                <div className="w-[200px] h-[20px] flex gap-1 relative">
                    {collaborators?.map((field:any, index:number) => {
                        if(field.status === 'pending') return;
                        return (
                            <div key={field.user?._id || index}> {/* Use the user's ID as the key, fall back to index */}
                                <img
                                    // Remove the key from the img element
                                    src={field.user?.avatar}
                                    className={`w-5 h-5 absolute rounded-full border-1 border-base-300`}
                                    style={{ right: `${index * 5}px` }}
                                />
                            </div>
                        )
                    })}
                </div>
                <button onClick={openManage} className="ml-1 btn btn-xs border-base-content/10 btn-primary">Manage Team</button>
            </div>
            <div className="ml-2 p-1 hover:bg-base-200 rounded-xs border-1 hover:border-base-content/10 border-base-content/0 cursor-pointer">
                <Ellipsis size={18}/>
            </div>
        </div>
    )
}

export const BoardHeaderLoading = () => {
    return (
        <div className="w-full flex items-center p-1 border-1 border-base-content/10 h-10">
            <div className="flex flex-col">
                <div className="ml-1 h-5 w-20 bg-base-content/50 rounded-xs animate-pulse"/>
            </div>
            <div className="flex ml-auto items-center gap-1">
                <div className="w-5 h-5 bg-base-content/50 rounded-full animate-pulse"/>
                <button className="ml-1 btn btn-xs bg-base-content/50 w-25 animate-pulse" />
            </div>
            <div className="ml-2 p-1">
                <Ellipsis size={18} className="text-base-content/50 animate-pulse"/>
            </div>
        </div>
    );
};
