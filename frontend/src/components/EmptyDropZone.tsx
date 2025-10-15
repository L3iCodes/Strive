import { useDroppable } from '@dnd-kit/core';

interface EmptyDropZoneProps{
    sectionId: string;
}

const EmptyDropZone = ( { sectionId }: EmptyDropZoneProps ) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `empty-placeholder-${sectionId}`,
    });

    return (
        <div 
            ref={setNodeRef}
            className={`w-full h-[80px] shrink-0 flex flex-col gap-1  rounded-xs border-dash border-base-content/10 ${
                isOver ? 'border-accent bg-primary/10' : 'border-primary/50'
            }`}
        >
        </div>
    );
}

export default EmptyDropZone