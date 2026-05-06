'use client';

import { useCallback, useState } from 'react';

export interface UseQuantityMapReturn<TId extends string | number = number> {
    quantities: Record<TId, number>;
    increment: (id: TId) => void;
    decrement: (id: TId) => void;
    setQuantity: (id: TId, value: number) => void;
    reset: () => void;
    get: (id: TId) => number;
}

export function useQuantityMap<TId extends string | number = number>(
    ids: TId[],
    initialValue = 0,
): UseQuantityMapReturn<TId> {
    const initialMap = ids.reduce(
        (acc, id) => {
            acc[id] = initialValue;
            return acc;
        },
        {} as Record<TId, number>,
    );

    const [quantities, setQuantities] = useState<Record<TId, number>>(
        initialMap,
    );

    const increment = useCallback((id: TId) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: (prev[id] ?? 0) + 1,
        }));
    }, []);

    const decrement = useCallback((id: TId) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max(0, (prev[id] ?? 0) - 1),
        }));
    }, []);

    const setQuantity = useCallback((id: TId, value: number) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max(0, value),
        }));
    }, []);

    const reset = useCallback(() => {
        setQuantities(initialMap);
    }, [initialMap]);

    const get = useCallback(
        (id: TId) => quantities[id] ?? 0,
        [quantities],
    );

    return {
        quantities,
        increment,
        decrement,
        setQuantity,
        reset,
        get,
    };
}
