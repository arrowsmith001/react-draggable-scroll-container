import React, { useEffect, useRef } from 'react';

interface DraggableProps {
    children: React.ReactNode;
    setScroll?: number;
    setScrollPercent?: number;
    scrollDecelFactor?: number;
    scrollSizeFactor?: number;
}

export interface DragInfo {
    scrollY: number;
}

const Draggable: React.FC<DraggableProps> = ({ children, setScroll, setScrollPercent, scrollDecelFactor = 0.1, scrollSizeFactor = 20 }) => {

    const scrollRef = useRef<HTMLDivElement>(null);
    const startYRef = useRef({ y: 0 });
    const scrollYRef = useRef({ scrollY: 0 });
    const velocityRef = useRef({ velocityY: 0 });


    function onDrag({ scrollY }: DragInfo) {
        scrollRef?.current?.scroll({ top: scrollY, behavior: 'auto' });
    };

    useEffect(() => {
        if (setScroll) {
            scrollRef?.current?.scroll({ top: setScroll, behavior: 'auto' });
        }
        else if (setScrollPercent) {
            scrollRef?.current?.scroll({ top: scrollRef?.current?.scrollHeight * setScrollPercent, behavior: 'auto' });
        }
    }, [setScroll]);


    var animationFrame: number;

    var ds: number;
    var scrollTarget: number;

    function updateScroll() {

        animationFrame = requestAnimationFrame(() => {

            const currentScroll = getCurrentScroll();

            const diff = scrollTarget - currentScroll;
            ds = scrollDecelFactor * diff;

            const newScrollY = currentScroll + ds;

            onDrag({ scrollY: newScrollY });

            if (Math.abs(ds) < 0.5) {
                cancelAnimationFrame(animationFrame);
            } else {
                updateScroll();
            }
        });
    }

    const onMouseDown = (e: any) => {
        cancelAnimationFrame(animationFrame);

        velocityRef.current.velocityY = 0;
        scrollTarget = 0;

        startYRef.current.y = e.clientY;
        scrollYRef.current.scrollY = scrollRef?.current?.scrollTop || 0;

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };


    const onMouseMove = (e: MouseEvent) => {

        const scrollY = scrollYRef.current.scrollY;
        const diff = e.clientY - startYRef.current.y;

        velocityRef.current.velocityY = e.movementY;

        onDrag({ scrollY: scrollY - diff });
    };

    const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        const velocity = velocityRef.current.velocityY;

        scrollTarget = getCurrentScroll() - (velocity * scrollSizeFactor);

        updateScroll();
    };

    function getCurrentScroll() {
        return (scrollRef?.current?.scrollTop || 0);
    }

    return (
        <div
            ref={scrollRef}
            onDrag={(e) => { e.preventDefault(); }} onDragStart={(e) => { e.preventDefault(); }} draggable={false}
            className={'draggable-child-wrapper'}
            onMouseDown={onMouseDown}
        >
            {children}
        </div>
    );
};

export default Draggable;