import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'


export const useSort = (id: UniqueIdentifier) => {
    const { attributes, listeners, transform, transition, isDragging, setNodeRef } = useSortable({id});
    const dragStyle = {
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return(
        {
            attributes,
            listeners,
            setNodeRef,
            dragStyle,
        }
    );
};