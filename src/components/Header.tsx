'use client'

import { LogoDeha } from './LogoDeha'
import { SearchBar } from './SearchBar'
import { Navigation } from './Navigation'
import { useSearch } from '@/contexts/SearchContext'

interface HeaderProps {
  showSearch?: boolean
  onSettingsClick?: () => void
}

export function Header({ showSearch = true, onSettingsClick }: HeaderProps) {
  const {
    dateRange = { from: null, to: null },
    selectedCity = '',
    magnitude = 0,
    setDateRange,
    setSelectedCity,
    setMagnitude,
    setIsSearched,
  } = useSearch()

  const handleSearch = (searchParams: {
    dateRange?: { from: Date | null; to: Date | null }
    selectedCity?: string
    magnitude?: number
  }) => {
    if (searchParams.dateRange) setDateRange(searchParams.dateRange)
    if (searchParams.selectedCity) setSelectedCity(searchParams.selectedCity)
    if (typeof searchParams.magnitude === 'number') setMagnitude(searchParams.magnitude)
    setIsSearched(true)
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b relative z-10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <LogoDeha />
        {showSearch && (
          <SearchBar
            onSearch={handleSearch}
            initialDateRange={dateRange}
            initialCity={selectedCity}
            initialMagnitude={magnitude}
          />
        )}
        <Navigation />
        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className="text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Settings
          </button>
        )}
      </div>
    </header>
  )
}
