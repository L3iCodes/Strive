import Task from "../models/task.model.js";
import Section from "../models/section.model.js";
import { createActivityService } from "../services/activity.service.js";

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
            due_date: "",
            priority: 'low',
            assignees: [],
            done: false
        });

        // Log into board
        await createActivityService(boardId, _id, `Created Task: [${name}]`)

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
    const { boardId, taskId } = req.body;

    try{
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Remove task reference from section
        await Section.findByIdAndUpdate(
            task.section,
            { $pull: { tasks: taskId } }
        );

        // Delete task
        await Task.findByIdAndDelete(taskId);

        // Log into board activity
        await createActivityService(
            boardId, 
            _id, 
            `Deleted Task: [${task.task_name} from [${task.section}]`
        );

        
        res.status(200).json(task)
    }catch(error){
        console.log('Error in deletTask controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};