import { MouseSensor, TouchSensor, useSensor, useSensors, type DragStartEvent, type Active } from '@dnd-kit/core'
import { useState } from 'react';

export const useDrag = () => {
    const [activeDragItem, setActiveDragItem] = useState<Active>();    
    
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8, 
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200, 
                tolerance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveDragItem( active );
    };

    return(
        { 
            sensors, 
            handleDragStart, 
        }
    );
};