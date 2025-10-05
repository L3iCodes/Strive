import { Plus } from "lucide-react"
import type { CheckList } from "../../types"

interface newSubtaskForm {
    subTasks: CheckList [] | undefined
}

const NewSubtaskForm = ({subTasks}: newSubtaskForm) => {
    return (
        <form>
            {/* TODO: LIST OF TASKS */}

            <div className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="Add a subtask..." 
                    required={true}
                    className="input w-full h-fit p-2 rounded-xs border-1 border-base-content/20 bg-base-300/0 text-xs"
                    onChange={(e) => e.stopPropagation()}
                />
                <button className="p-1 bg-base-100 border-1 border-base-content/20 rounded-xs hover:bg-primary hover:text-primary-content active:bg-base-300 cursor-pointer"><Plus /></button>
            </div>
            
        </form>
    )
}

export default NewSubtaskForm
