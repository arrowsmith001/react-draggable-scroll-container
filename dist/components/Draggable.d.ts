import React from 'react';
interface DraggableProps {
    children: React.ReactNode;
    setScroll?: number;
    setScrollPercent?: number;
    scrollDecelFactor?: number;
    scrollSizeFactor?: number;
}
declare const Draggable: React.FC<DraggableProps>;
export default Draggable;
