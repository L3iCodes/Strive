import Section from "../models/section.model.js";
import Task from "../models/task.model.js"
import User from "../models/user.model";

export const deleteTaskService = async (sectionId, taskId) => {
    try {
        await Task.findByIdAndDelete(taskId);
        await Section.findByIdAndUpdate(
            sectionId,
            { $pull: { tasks: taskId } }
        )
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
};

export const deleteSection = async (boardId, sectionId) => {
    
}