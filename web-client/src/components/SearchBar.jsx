import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

/**
 * Advanced Reusable SearchBar Component
 *
 * @param {Object} props
 * @param {Function} props.onSearch - Callback when search is triggered (receives searchTerm, filters)
 * @param {string} props.placeholder - Input placeholder text
 * @param {Array} props.filterOptions - Array of filter objects: [{ label, value, options: [{label, value}] }]
 * @param {number} props.debounceMs - Debounce delay in milliseconds (default: 300)
 * @param {boolean} props.showClearButton - Show clear button (default: true)
 * @param {string} props.className - Additional CSS classes
 */
const SearchBar = ({
                       onSearch,
                       placeholder = "Search...",
                       filterOptions = [],
                       debounceMs = 300,
                       showClearButton = true,
                       className = "",
                   }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({});
    const [debouncedTerm, setDebouncedTerm] = useState("");

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [searchTerm, debounceMs]);

    // Trigger search when debounced term or filters change
    useEffect(() => {
        if (onSearch) {
            onSearch(debouncedTerm, filters);
        }
    }, [debouncedTerm, filters, onSearch]);

    const handleClear = () => {
        setSearchTerm("");
        setFilters({});
    };

    const handleFilterChange = (filterKey, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterKey]: value === "all" ? undefined : value,
        }));
    };

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            <div className="flex flex-wrap gap-2">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-9"
                    />
                    {showClearButton && (searchTerm || Object.keys(filters).length > 0) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                            onClick={handleClear}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Filter Dropdowns */}
                {filterOptions.map((filter) => (
                    <Select
                        key={filter.value}
                        value={filters[filter.value] || "all"}
                        onValueChange={(value) => handleFilterChange(filter.value, value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={filter.label} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All {filter.label}</SelectItem>
                            {filter.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ))}
            </div>

            {/* Active Filters Display */}
            {(searchTerm || Object.keys(filters).some(key => filters[key])) && (
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {searchTerm && (
                        <span className="rounded-md bg-muted px-2 py-1">
                            Search: "{searchTerm}"
                        </span>
                    )}
                    {Object.entries(filters).map(([key, value]) => {
                        if (!value) return null;
                        const filter = filterOptions.find(f => f.value === key);
                        const option = filter?.options.find(o => o.value === value);
                        return (
                            <span key={key} className="rounded-md bg-muted px-2 py-1">
                                {filter?.label}: {option?.label || value}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchBar;