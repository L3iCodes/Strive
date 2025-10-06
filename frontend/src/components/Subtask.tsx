import React from 'react'
import type { CheckList } from '../types'
import { Trash } from 'lucide-react';

interface SubtaskProps {
    subtask: CheckList;
}

const Subtask = ({subtask}: SubtaskProps) => {
    return (
        <div className="p-2 flex items-center gap-2 rounded-xs hover:bg-base-100">
            <input type="checkbox" checked={subtask.done}/>
            <p>{subtask.sub_task}</p>

            <div className='ml-auto hover:bg-error hover:text-error-content cursor-pointer p-[2px]'>
                <Trash size={15} />
            </div>  
        </div>
    )
}

export default Subtask
