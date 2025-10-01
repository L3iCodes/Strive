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
    checklist: [ChecklistSchema],
    due_date: { type: Date },
    priority: { type: String, enum: ["", "low", "medium", "high"], default: "" },
    assignees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', TaskSchema);
export default Task;