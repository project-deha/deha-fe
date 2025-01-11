'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type CustomDateRange = {
    from: Date | null
    to: Date | null
}

interface SearchContextType {
    dateRange?: CustomDateRange
    selectedCity?: string
    magnitude?: number
    isSearched: boolean
    setDateRange: (range?: CustomDateRange) => void
    setSelectedCity: (city?: string) => void
    setMagnitude: (magnitude?: number) => void
    setIsSearched: (isSearched: boolean) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
    const [dateRange, setDateRange] = useState<CustomDateRange | undefined>({ from: null, to: null })
    const [selectedCity, setSelectedCity] = useState<string>('')
    const [magnitude, setMagnitude] = useState<number>(0)
    const [isSearched, setIsSearched] = useState(false)

    return (
        <SearchContext.Provider
            value={{
                dateRange,
                selectedCity,
                magnitude,
                isSearched,
                setDateRange,
                setSelectedCity,
                setMagnitude,
                setIsSearched,
            }}
        >
            {children}
        </SearchContext.Provider>
    )
}

export function useSearch() {
    const context = useContext(SearchContext)
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider')
    }
    return context
}

