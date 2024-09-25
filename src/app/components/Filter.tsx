"use client";

import { useState, useEffect } from 'react';
import { Application } from '../home/page';

interface FilterProps {
  onFilterChange: (filters: any) => void;
  applications: Application[];
}

export default function Filter({ onFilterChange, applications }: FilterProps) {
  const [filters, setFilters] = useState({
    country: '',
    university: '',
    duration: '',
    language: '',
    costRange: [0, 0],
  });
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showCostResetButton, setShowCostResetButton] = useState(false);
  const [costLimits, setCostLimits] = useState({ min: 0, max: 0 });

  useEffect(() => {
    const costs = applications.map(app => app.cost); 
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);

    setCostLimits({ min: minCost, max: maxCost });
    setFilters(prev => ({ ...prev, costRange: [minCost, maxCost] }));
  }, [applications]);

  const handleChange = (key: string, value: string | number[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    if (Array.isArray(value)) {
      const filterLabel = `Cost: $${value[0]} - $${value[1]}`;
      setSelectedFilters((prev) => {
        const existingIndex = prev.findIndex(f => f.startsWith('Cost:'));
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = filterLabel;
          return updated;
        }
        return [...prev, filterLabel];
      });
    } else {
      const filterLabel = value ? `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}` : '';
      setSelectedFilters((prev) => value ? [...prev, filterLabel] : prev.filter(f => !f.startsWith(`${key.charAt(0).toUpperCase() + key.slice(1)}:`)));
    }

    onFilterChange(newFilters);
  };

  const handleRemoveFilter = (filter: string) => {
    const [key] = filter.split(': ');

    if (key === 'Cost') {
      setFilters({ ...filters, costRange: [costLimits.min, costLimits.max] });
    } else {
      setFilters({ ...filters, [key.toLowerCase()]: '' });
    }

    setSelectedFilters((prev) => prev.filter(f => f !== filter));
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      country: '',
      university: '',
      duration: '',
      language: '',
      costRange: [costLimits.min, costLimits.max],
    });
    setSelectedFilters([]);
    setShowCostResetButton(false);
    onFilterChange({
      country: '',
      university: '',
      duration: '',
      language: '',
      costRange: [costLimits.min, costLimits.max],
    });
  };

  const handleSliderChangeMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const [_, max] = filters.costRange;

    if (value <= max) {
      setFilters(prev => ({ ...prev, costRange: [value, max] }));
      onFilterChange({ ...filters, costRange: [value, max] });
      setShowCostResetButton(true);
    }
  };

  const handleSliderChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const [min] = filters.costRange;

    if (value >= min) {
      setFilters(prev => ({ ...prev, costRange: [min, value] }));
      onFilterChange({ ...filters, costRange: [min, value] });
      setShowCostResetButton(true);
    }
  };

  const resetCostRange = () => {
    setFilters(prev => ({ ...prev, costRange: [costLimits.min, costLimits.max] }));
    onFilterChange({ ...filters, costRange: [costLimits.min, costLimits.max] });
    setShowCostResetButton(false);
  };

  return (
    <div className="mb-4 p-4 bg-white rounded shadow-lg">
      <h3 className="text-xl font-semibold mb-2">Filters</h3>
      <div className="grid grid-cols-1 gap-4">

        <div className="w-full">
          <select
            value={filters.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">Select Country</option>
            {Array.from(new Set(applications.map(app => app.country))).map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <select
            value={filters.university}
            onChange={(e) => handleChange('university', e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">Select University</option>
            {Array.from(new Set(applications.map(app => app.university))).map((univ, index) => (
              <option key={index} value={univ}>{univ}</option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <select
            value={filters.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">Select Duration</option>
            {['1 year', '2 years', '3 years', '4 years', '5 years', '6 years', '7 years', '8 years'].map((dur, index) => (
              <option key={index} value={dur}>{dur}</option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <select
            value={filters.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">Select Language</option>
            {['English', 'French', 'Turkish'].map((lang, index) => (
              <option key={index} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="w-full mt-4">
          <label className="block mb-2">
            Cost Range: ${filters.costRange[0]} - ${filters.costRange[1]}
          </label>
          <div className="relative">
            <input
              type="range"
              min={costLimits.min}
              max={costLimits.max}
              value={filters.costRange[0]}
              onChange={handleSliderChangeMin}
              className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer"
              style={{ background: `linear-gradient(to right, #4CAF50 ${((filters.costRange[0] - costLimits.min) / (costLimits.max - costLimits.min)) * 100}%, #ccc ${((filters.costRange[0] - costLimits.min) / (costLimits.max - costLimits.min)) * 100}%)` }}
            />
            <input
              type="range"
              min={costLimits.min}
              max={costLimits.max}
              value={filters.costRange[1]}
              onChange={handleSliderChangeMax}
              className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer mt-2"
              style={{ background: `linear-gradient(to right, #4CAF50 ${((filters.costRange[1] - costLimits.min) / (costLimits.max - costLimits.min)) * 100}%, #ccc ${((filters.costRange[1] - costLimits.min) / (costLimits.max - costLimits.min)) * 100}%)` }}
            />
          </div>
          {showCostResetButton && (
            <button
              onClick={resetCostRange}
              className="mr-2 mt-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            >
              Reset Cost Range &times;
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap mb-4">
            {selectedFilters.map((filter, index) => (
              <button
                key={index}
                onClick={() => handleRemoveFilter(filter)}
                className="mr-2 mb-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              >
                {filter} &times;
              </button>
            ))}
          </div>
        )}
        {selectedFilters.length > 0 && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
}
