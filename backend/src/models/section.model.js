import mongoose from "mongoose";
const { Schema } = mongoose;

const SectionSchema = new Schema({
    name: { type: String, required: true },
    board: { type: Schema.Types.ObjectId, ref: "Board" },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }]
}, { timestamps: true });

const Section = mongoose.model('Section', SectionSchema);
export default Section;