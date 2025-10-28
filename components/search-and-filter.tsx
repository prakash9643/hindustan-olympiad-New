"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SearchAndFilterProps {
  search: string
  onSearchChange: (search: string) => void
  filters: Record<string, string>
  onFiltersChange: (filters: Record<string, string>) => void
  filterOptions: {
    key: string
    label: string
    options: { value: string; label: string }[]
  }[]
  placeholder?: string
  sortBy: string
  sortOptions: {
    key: string
    label: string
  }[],
  onSortChange: (sortBy: string) => void
}

export default function SearchAndFilter({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  filterOptions,
  placeholder = "Search...",
  sortBy = "name",
  sortOptions,
  onSortChange,
}: SearchAndFilterProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => ({ ...acc, [key]: "" }), {})
    onFiltersChange(clearedFilters)
    onSearchChange("")
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== "").length + (search ? 1 : 0)
  }

  const getActiveFilterLabels = () => {
    const labels = []
    if (search) {
      labels.push(`Search: "${search}"`)
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        const filterOption = filterOptions.find((option) => option.key === key)
        const valueOption = filterOption?.options.find((option) => option.value === value)
        if (filterOption && valueOption) {
          labels.push(`${filterOption.label}: ${valueOption.label}`)
        }
      }
    })
    return labels
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={placeholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={sortBy || ""}
            onValueChange={(value) => onSortChange(value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder={`Sort by`} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getActiveFiltersCount() > 0 && (
            <Button variant="outline" onClick={clearAllFilters} size="sm">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {getActiveFilterLabels().map((label, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterOptions.map((filterOption) => (
                <div key={filterOption.key} className="space-y-2">
                  <Label htmlFor={filterOption.key}>{filterOption.label}</Label>
                  <Select
                    value={filters[filterOption.key] || ""}
                    onValueChange={(value) => handleFilterChange(filterOption.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${filterOption.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All {filterOption.label}</SelectItem>
                      {filterOption.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
