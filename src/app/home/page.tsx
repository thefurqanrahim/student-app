"use client";

import React, { useEffect, useState } from 'react';
import ApplicationCard from '../components/ApplicationCard';
import Filter from '../components/Filter';
import Pagination from '../components/Pagination';
import Sort from '../components/Sort';
import { useRouter } from 'next/navigation';

export interface Filters {
  name: string;
  country: string;
  university: string;
  duration: string;
  language: string;
  costRange: [number, number];
}

export interface Application {
  id: number;
  name: string;
  university: string;
  country: string;
  duration: string;
  cost: number;
  deadline: string;
  language: string;
}

const HomePage = () => {
  const router = useRouter();
  const [applicationsData, setApplicationsData] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [filters, setFilters] = useState<Filters>({
    name: '',
    country: '',
    university: '',
    duration: '',
    language: '',
    costRange: [0, 0],
  });
  const [sortType, setSortType] = useState('');

  useEffect(() => {
    const generatedData: Application[] = Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      name: ['John', 'Ceina', 'Luis', 'Akshay', 'Akhtar', 'Sam', 'Neha', 'Johnny', 'Albert'][Math.floor(Math.random() * 9)],
      university: ['UK University', 'Oxford University', 'Turkey University', 'Canada University', 'Indus University', 'France University'][Math.floor(Math.random() * 6)],
      country: ['UK', 'USA', 'Turkey', 'Canada', 'Pakistan', 'France'][Math.floor(Math.random() * 6)],
      duration: `${Math.floor(Math.random() * 8) + 1} years`,
      cost: Math.floor(Math.random() * 20000) + 1000,
      deadline: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
      language: ['English', 'French', 'Turkish'][Math.floor(Math.random() * 3)],
    }));

    setApplicationsData(generatedData);
    setFilteredApplications(generatedData);
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    applyFiltersAndSort(newFilters, sortType);
  };

  const handleSortChange = (sort: string) => {
    setSortType(sort);
    applyFiltersAndSort(filters, sort);
  };

  const applyFiltersAndSort = (filters: Filters, sortType: string) => {
    const filtered = applicationsData.filter(app => {
      return (
        (filters.name ? app.name === filters.name : true) &&
        (filters.country ? app.country === filters.country : true) &&
        (filters.university ? app.university === filters.university : true) &&
        (filters.duration ? app.duration.startsWith(filters.duration) : true) &&
        (filters.language ? app.language === filters.language : true) &&
        (app.cost >= filters.costRange[0] && app.cost <= filters.costRange[1])
      );
    });

    if (sortType === 'lowToHigh') {
      filtered.sort((a, b) => a.cost - b.cost);
    } else if (sortType === 'highToLow') {
      filtered.sort((a, b) => b.cost - a.cost);
    } else if (sortType === 'deadline') {
      filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    }

    setFilteredApplications(filtered);
    setCurrentPage(1);
  };

  const currentApplications = filteredApplications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6">Students Application System</h1>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-3 sm:col-span-12">
            <Filter onFilterChange={handleFilterChange} applications={applicationsData} />
            <Sort setSortType={handleSortChange} sortType={sortType} />
          </div>

          <div className="md:col-span-9 sm:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentApplications.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredApplications.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default HomePage;
