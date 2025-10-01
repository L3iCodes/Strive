import { Ellipsis } from "lucide-react"
import { type Collaborators } from "../store/useBoardStore";

interface BoardHeaderProps{
    name: string;
    collaborators: Collaborators[];
}

const BoardHeader = ({name, collaborators}: BoardHeaderProps) => {
    return (
        <div className="w-full flex items-center p-1 border-1 border-base-content/10 h-10">
            <div className="flex flex-col">
                <h1 className="font-bold ml-1">{name}</h1>
            </div>
            <div className="flex ml-auto items-center gap-1">
                <div className="flex gap-1">
                    {collaborators?.map((field:any) => {
                        // if(field.status === 'pending') return;
                        return (<>
                            <img 
                                key={field.user?._id}
                                src={field.user?.avatar}
                                className="w-5 h-5"
                            />
                        </>    
                        )
                    })}
                </div>
                <button className="ml-1 btn btn-xs border-base-content/10 btn-primary">Manage Team</button>
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

export default BoardHeader
