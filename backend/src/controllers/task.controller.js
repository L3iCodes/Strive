import Task from "../models/task.model.js";
import Section from "../models/section.model.js";
import { createActivityService } from "../services/activity.service.js";

export const getTask = async (req, res) => {
    const { taskId } = req.params;

    try{
        const task = await Task.findById(taskId).populate('assignees', '_id username email');
        if(!task) return res.status(404).json({ message: "Task not found" });

        res.status(200).json(task)
    }catch(error){
        console.log('Error in getTask controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const createTask = async (req, res) => {
    const { _id } = req.user;
    const { boardId, sectionId, name, desc, position } = req.body;

    try{
        const task = await Task.create({
            task_name: name.trim() === "" ? "New Task" : name.trim(),
            description: desc,
            board: boardId,
            section: sectionId,
            checklist: [],
            due_date: undefined,
            priority: 'none',
            assignees: [],
            done: false
        });

        // Log into board
        await createActivityService(boardId, _id, `Created Task: [${task.name}]`)

        // Push into section
        await Section.findByIdAndUpdate(
            sectionId,
            position === "top"
                ? { $push: { tasks: { $each: [task._id], $position: 0 } } } // push at start
                : { $push: { tasks: task._id } }, // push at end
            { new: true }
        );

        res.status(201).json({task});
    }catch(error){
        console.log('Error in addTask controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const deleteTask = async (req, res) => {
    const { _id } = req.user;
    const { taskId } = req.params;

    try{
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });
        

        // Remove task reference from section
        await Section.findByIdAndUpdate(
            task.section,
            { $pull: { tasks: task._id } }
        );

        // Delete task
        await Task.findByIdAndDelete(task._id);

        // Log into board activity
        await createActivityService(
            task.board, 
            _id, 
            `Deleted Task: [${task.task_name} from [${task.section}]`
        );

        
        res.status(200).json(task)
    }catch(error){
        console.log('Error in deletTask controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const updateTaskInfo = async (req, res) => {
    const { _id } = req.user;
    const { taskId, task_name, priority, dueDate, description } = req.body;

    try{
        const task = await Task.findByIdAndUpdate(
            taskId,
            { 
                task_name,
                priority,
                due_date: dueDate,
                description
            },
            { new: true }
        );
        if(!task) return res.status(404).json({ message: "Task not found" });
       
        //Log into board activity
        await createActivityService(
            task.board, 
            _id, 
            `Task Updated: [${task.task_name} from [${task.section}]`
        );

        res.status(200).json(task)
    }catch(error){
        console.log('Error in updateTaskInfo controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const addSubtask = async (req, res) => {
    const { _id } = req.user;
    const { taskId, subtaskData } = req.body;

    try{
        const task = await Task.findByIdAndUpdate(
            taskId,
            { $push: { checklist: subtaskData } },
            { new: true }
        );
        if(!task) return res.status(404).json({ message: "Task not found" });

        //Log into board activity
        await createActivityService(
            task.board, 
            _id, 
            `Subtask Added: [${subtaskData.name} to [${task.task_name}]`
        );

        res.status(201).json(task)
    }catch(error){
        console.log('Error in addSubtask controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const deleteSubtask = async (req, res) => {
    const { _id } = req.user;
    const { taskId, subtaskId } = req.body;

    try{
        const task = await Task.findByIdAndUpdate(
            taskId,
            { $pull: { checklist: { _id: subtaskId} } },
            { new: true }
        );
        if(!task) return res.status(404).json({ message: "Task not found" });

        //Log into board activity
        await createActivityService(
            task.board, 
            _id, 
            `Subtask deleted: from [${task.task_name}]`
        );

        res.status(201).json(task)
    }catch(error){
        console.log('Error in deleteSubtask controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const updateSubtask = async (req, res) => {
    const { _id } = req.user;
    const { taskId, subtaskData } = req.body;
   
    try{
        const task = await Task.findOneAndUpdate(
            { _id: taskId, "checklist._id": subtaskData._id }, // find the task with that checklist item
            {
                $set: {
                    "checklist.$.sub_task": subtaskData.sub_task,
                    "checklist.$.done": subtaskData.done,
                }
            },
            { new: true } // return the updated document
        );
        if(!task) return res.status(404).json({ message: "Task not found" });

        //Log into board activity
        await createActivityService(
            task.board, 
            _id, 
            `Subtask Updated: from [${task.task_name}]`
        );

        res.status(201).json(task)
    }catch(error){
        console.log('Error in deleteSubtask controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const moveTask = async (req, res) => {
    const { receiverSectionId, taskId } = req.body;

    try{
        const task = await Task.findByIdAndUpdate(
            taskId,
            { $set: { section: receiverSectionId } },
        );

        if(!task) return res.status(404).json({ message: "Task not found" });

        // Remove task from original section
        await Section.findByIdAndUpdate(
            task.section,
            { $pull: { tasks: task._id  } }
        );

        // Move to receiver section
        await Section.findByIdAndUpdate(
            receiverSectionId,
            { $push: { tasks: task._id  } }
        );

        res.status(201).json({ message: "Succesfully moved task"})
    }catch(error){
        console.log('Error in moveTask controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};