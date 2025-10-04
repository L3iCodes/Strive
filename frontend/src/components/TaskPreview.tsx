import { useBoardStore } from "../store/useTaskStore"

const TaskPreview = () => {
    const { isPreviewOpen, closePreview, task } = useBoardStore();

    return (
        <div className={`h-full pt-[65px] p-5 md:p-5 w-md max-w-md fixed top-0 bg-base-300 border-1 border-base-content/20 z-10 
                        transition-all duration-150 ease-in-out
                        ${isPreviewOpen ? 'right-0' : '-right-150'}`}
        >
            <h1>{task?.task_name}</h1>
            
            <button onClick={closePreview} className="btn btn-primary"> Close </button>
        </div>
    )
}

export default TaskPreview
