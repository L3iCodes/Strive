import mongoose from "mongoose";
const { Schema } = mongoose;

const ChecklistSchema = new Schema({
    sub_task: { type: String, required: true },
    done: { type: Boolean, default: false },
});

const TaskSchema = new Schema(
  {
    task_name: { type: String, required: true },
    description: { type: String },
    board: { type: Schema.Types.ObjectId, ref: "Board" },
    section: { type: Schema.Types.ObjectId, ref: "Section" },
    checklist: [ChecklistSchema],
    due_date: { type: Date },
    priority: { type: String, enum: ["none","low", "medium", "high"], default: "none" },
    assignees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    done: {type: Boolean, default: false}
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', TaskSchema);
export default Task;
