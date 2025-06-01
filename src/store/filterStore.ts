import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FilterState {
    startDate: string;
    endDate: string;
    city: string;
    minMagnitude: number;
    maxMagnitude: number;
    setFilters: (filters: Partial<Omit<FilterState, 'setFilters' | 'resetFilters'>>) => void;
    resetFilters: () => void;
}

const initialState = {
    startDate: '',
    endDate: '',
    city: '',
    minMagnitude: 0,
    maxMagnitude: 10
} as const;

export const useFilterStore = create<FilterState>()(
    persist(
        (set) => ({
            ...initialState,
            setFilters: (filters) => set((state) => ({ ...state, ...filters })),
            resetFilters: () => set(initialState),
        }),
        {
            name: 'filter-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
); 