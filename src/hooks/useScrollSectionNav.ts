import { useEffect, useRef, useCallback } from 'react';

/**
 * Hijacks wheel events on the page to advance or retreat through
 * a list of section IDs. Uses a cooldown to prevent rapid firing.
 */
export function useScrollSectionNav(
    sectionIds: string[],
    activeId: string,
    onSelect: (id: string) => void,
) {
    const cooldownRef = useRef(false);
    const cooldownTimer = useRef<ReturnType<typeof setTimeout>>();

    const handleWheel = useCallback(
        (event: WheelEvent) => {
            // Ignore tiny trackpad noise
            if (Math.abs(event.deltaY) < 30) return;
            if (cooldownRef.current) return;

            const currentIndex = sectionIds.indexOf(activeId);
            if (currentIndex === -1) return;

            let nextIndex: number;
            if (event.deltaY > 0) {
                // Scrolling down → next section
                nextIndex = currentIndex + 1;
            } else {
                // Scrolling up → previous section
                nextIndex = currentIndex - 1;
            }

            if (nextIndex < 0 || nextIndex >= sectionIds.length) return;

            event.preventDefault();
            onSelect(sectionIds[nextIndex]);

            // Cooldown to prevent rapid-fire
            cooldownRef.current = true;
            clearTimeout(cooldownTimer.current);
            cooldownTimer.current = setTimeout(() => {
                cooldownRef.current = false;
            }, 600);
        },
        [sectionIds, activeId, onSelect],
    );

    useEffect(() => {
        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            window.removeEventListener('wheel', handleWheel);
            clearTimeout(cooldownTimer.current);
        };
    }, [handleWheel]);
}
