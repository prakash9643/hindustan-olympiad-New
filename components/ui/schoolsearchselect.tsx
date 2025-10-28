"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

import type { School } from "@/types/school"

interface SchoolSearchSelectProps {
  onSchoolSelect: (school: any) => void
  selectedSchool?: School | null
}

export default function SchoolSearchSelect({ onSchoolSelect, selectedSchool }: SchoolSearchSelectProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchSchools(searchQuery)
      } else {
        setSchools([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const searchSchools = async (query: string) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(
        `/api/schools?query=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
          },
        },
      )
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to fetch schools")
      }

      const data = await response.json()
      setSchools(data.schools || [])
      setIsOpen(true)
    } catch (err) {
      setError("Failed to search schools. Please try again.")
      setSchools([])
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSchoolSelect = (school: School) => {
    onSchoolSelect(school)
    setSearchQuery("")
    setIsOpen(false)
    setSchools([])
  }

  const handleInputFocus = () => {
    if (schools.length > 0) {
      setIsOpen(true)
    }
  }

  const clearSelection = () => {
    onSchoolSelect(null as any)
    setSearchQuery("")
    setSchools([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full max-w-sm" ref={dropdownRef}>
      {/* Selected School Display */}
      {selectedSchool && (
        <Card className="mb-4 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="space-y-1">
                  <div className="font-semibold text-gray-900">{selectedSchool.schoolName}</div>
                  <div className="text-sm text-gray-600">{selectedSchool.branch}</div>
                  <div className="text-xs text-gray-500">ID: {selectedSchool.schoolId}</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearSelection} className="text-gray-500 hover:text-gray-700">
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Input */}
      <div className={`relative ${selectedSchool? "hidden" : ""}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            placeholder="Search for schools by name, ID, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleInputFocus}
            className="pl-10 pr-10"
            disabled={!!selectedSchool}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
            </div>
          )}
          {!isLoading && schools.length > 0 && (
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          )}
        </div>

        {/* Error Message */}
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

        {/* Search Results Dropdown */}
        {isOpen && schools.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto shadow-lg">
            <CardContent className="p-0">
              {schools.map((school) => (
                <div
                  key={school._id}
                  onClick={() => handleSchoolSelect(school)}
                  className={cn(
                    "p-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors",
                    "focus:bg-gray-50 focus:outline-none",
                  )}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleSchoolSelect(school)
                    }
                  }}
                >
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-gray-900 leading-tight">{school.schoolName}</div>
                    <div className="text-sm text-gray-600 leading-tight">{school.branch}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{school.schoolId}</span>
                      <span>•</span>
                      <span>
                        {school.city}, {school.district}
                      </span>
                      <span>•</span>
                      <span>{school.board}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* No Results Message */}
        {isOpen && schools.length === 0 && searchQuery.trim() && !isLoading && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
            <CardContent className="p-4 text-center text-gray-500">No schools found for &quot;{searchQuery}&quot;</CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
