
import React from "react";
import { useHealthData } from "@/context/HealthDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

export function FilterPanel() {
  const { filters, filterSelections, setFilterSelections } = useHealthData();
  
  const handleReset = () => {
    setFilterSelections({});
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filters
          </CardTitle>
          {Object.keys(filterSelections).length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <X className="h-4 w-4 mr-1" /> Reset
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.id} className="space-y-2">
            <Label htmlFor={filter.key}>{filter.name}</Label>
            
            {filter.type === "dropdown" && (
              <Select
                value={filterSelections[filter.key] || ""}
                onValueChange={(value) => 
                  setFilterSelections(prev => ({ ...prev, [filter.key]: value }))
                }
              >
                <SelectTrigger id={filter.key}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  {filter.options?.map((option) => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {filter.type === "multiselect" && filter.options && (
              <div className="space-y-2">
                {filter.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={
                        Array.isArray(filterSelections[filter.key]) && 
                        filterSelections[filter.key]?.includes(option.value)
                      }
                      onCheckedChange={(checked) => {
                        setFilterSelections(prev => {
                          const current = Array.isArray(prev[filter.key]) 
                            ? [...prev[filter.key]] 
                            : [];
                          
                          if (checked) {
                            return {
                              ...prev,
                              [filter.key]: [...current, option.value]
                            };
                          } else {
                            return {
                              ...prev,
                              [filter.key]: current.filter(val => val !== option.value)
                            };
                          }
                        });
                      }}
                    />
                    <Label 
                      htmlFor={option.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            
            {filter.type === "boolean" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={filter.key}
                  checked={!!filterSelections[filter.key]}
                  onCheckedChange={(checked) => {
                    setFilterSelections(prev => ({
                      ...prev,
                      [filter.key]: !!checked
                    }));
                  }}
                />
                <Label 
                  htmlFor={filter.key}
                  className="text-sm font-normal cursor-pointer"
                >
                  Yes
                </Label>
              </div>
            )}
            
            {filter.type === "range" && filter.min !== undefined && filter.max !== undefined && (
              <div className="space-y-2">
                <Slider
                  id={filter.key}
                  min={filter.min}
                  max={filter.max}
                  step={10}
                  value={[filterSelections[filter.key] || filter.min]}
                  onValueChange={(value) => {
                    setFilterSelections(prev => ({
                      ...prev,
                      [filter.key]: value[0]
                    }));
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>${filter.min}</span>
                  <span>${filterSelections[filter.key] || filter.min}</span>
                  <span>${filter.max}</span>
                </div>
              </div>
            )}
            
            {filter.type === "text" && (
              <Input
                id={filter.key}
                value={filterSelections[filter.key] || ""}
                onChange={(e) => {
                  setFilterSelections(prev => ({
                    ...prev,
                    [filter.key]: e.target.value
                  }));
                }}
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
