"use client";

import React from 'react';
import { Application } from '../home/page';

const ApplicationCard: React.FC<{ app: Application }> = ({ app }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105">
      <h2 className="text-2xl font-semibold mb-2">{app.name}</h2>
      <p className="text-gray-700">University: {app.university}</p>
      <p className="text-gray-700">Country: {app.country}</p>
      <p className="text-gray-700">Duration: {app.duration}</p>
      <p className="text-gray-700">Cost: ${app.cost}</p>
      <p className="text-gray-700">Deadline: {app.deadline}</p>
      <p className="text-gray-700">Language: {app.language}</p>
    </div>
  );
};

export default ApplicationCard;
