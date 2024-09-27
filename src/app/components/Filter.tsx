"use client";

import { useState, useEffect } from 'react';
import { Application, Filters } from '../home/page';

interface FilterProps {
  onFilterChange: (filters: Filters) => void;
  applications: Application[];
}

export default function Filter({ onFilterChange, applications }: FilterProps) {
  const [filters, setFilters] = useState<Filters>({
    name: '',
    country: '',
    university: '',
    duration: '',
    language: '',
    costRange: [0, 0] as [number, number],
  });

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showCostResetButton, setShowCostResetButton] = useState(false);
  const [costLimits, setCostLimits] = useState({ min: 0, max: 0 });

  useEffect(() => {
    const costs = applications.map(app => app.cost);
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);

    setCostLimits({ min: minCost, max: maxCost });
    setFilters(prev => ({ ...prev, costRange: [minCost, maxCost] as [number, number] }));
  }, [applications]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));

    const filterLabel = value ? `${name.charAt(0).toUpperCase() + name.slice(1)}: ${value}` : '';
    setSelectedFilters(prev => {
      const existingIndex = prev.findIndex(f => f.startsWith(`${name.charAt(0).toUpperCase() + name.slice(1)}:`));
      if (existingIndex !== -1) {
        const updated = [...prev];
        if (filterLabel) {
          updated[existingIndex] = filterLabel;
        } else {
          updated.splice(existingIndex, 1);
        }
        return updated;
      }
      return filterLabel ? [...prev, filterLabel] : prev;
    });
  };

  const handleRemoveFilter = (filter: string) => {
    const [key] = filter.split(': ');

    if (key === 'Cost') {
      setFilters(prevFilters => ({
        ...prevFilters,
        costRange: [costLimits.min, costLimits.max] as [number, number],
      }));
      setShowCostResetButton(false);
    } else {
      setFilters(prevFilters => ({
        ...prevFilters,
        [key.toLowerCase()]: '',
      }));
    }

    setSelectedFilters(prev => prev.filter(f => f !== filter));
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      country: '',
      university: '',
      duration: '',
      language: '',
      costRange: [costLimits.min, costLimits.max] as [number, number],
    });
    setSelectedFilters([]);
    setShowCostResetButton(false);
  };

  const handleSliderChangeMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const [, max] = filters.costRange;

    if (value <= max) {
      const updatedCostRange: [number, number] = [value, max];
      setFilters(prev => ({ ...prev, costRange: updatedCostRange }));
      setShowCostResetButton(true);
    }
  };

  const handleSliderChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const [min] = filters.costRange;

    if (value >= min) {
      const updatedCostRange: [number, number] = [min, value];
      setFilters(prev => ({ ...prev, costRange: updatedCostRange }));
      setShowCostResetButton(true);
    }
  };

  const resetCostRange = () => {
    const defaultCostRange: [number, number] = [costLimits.min, costLimits.max];
    setFilters(prev => ({ ...prev, costRange: defaultCostRange }));
    setShowCostResetButton(false);
  };

  return (
    <div className="mb-4 p-4 bg-white rounded shadow-lg">
      <h3 className="text-xl font-semibold mb-2">Filters</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="w-full">
          <select
            name="name"
            value={filters.name}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          >
            <option value="">Select Name</option>
            {Array.from(new Set(applications.map(app => app.name))).map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <select
            name="country"
            value={filters.country}
            onChange={handleChange}
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
            name="university"
            value={filters.university}
            onChange={handleChange}
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
            name="duration"
            value={filters.duration}
            onChange={handleChange}
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
            name="language"
            value={filters.language}
            onChange={handleChange}
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
            />
            <input
              type="range"
              min={costLimits.min}
              max={costLimits.max}
              value={filters.costRange[1]}
              onChange={handleSliderChangeMax}
              className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer mt-2"
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
