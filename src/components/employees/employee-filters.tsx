"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";

export function EmployeeFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    type: ""
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const hasFilters = Object.values(filters).some(Boolean);

  const handleReset = () => {
    setFilters({ role: "", status: "", type: "" });
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <Button 
        variant="outline" 
        className="gap-2 bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {hasFilters && (
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600">
            {Object.values(filters).filter(Boolean).length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 w-full min-w-[16rem] max-w-[18rem] rounded-xl border border-gray-200 bg-white p-4 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 sm:left-auto sm:w-72">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {hasFilters && (
              <button 
                onClick={handleReset}
                className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
              >
                <X size={12} />
                Reset
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Role</label>
              <Select 
                value={filters.role} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="manager">Product Manager</SelectItem>
                  <SelectItem value="hr">HR Specialist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Status</label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="probation">Probation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Employment Type</label>
              <Select 
                value={filters.type} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 flex justify-end">
               <Button 
                size="sm" 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setIsOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
