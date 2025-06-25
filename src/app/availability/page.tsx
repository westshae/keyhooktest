'use client';

import { useState } from 'react';
import Grid from '@/components/custom/Grid';

export default function Availability() {
  const [isEditing, setIsEditing] = useState(false);
  const [viewEvents] = useState([]);
  const [editEvents] = useState([]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCellClick = (day: number, hour: number, subCell: number) => {
    console.log(`Clicked: Day ${day}, Hour ${hour}, Sub-cell ${subCell} in ${isEditing ? 'edit' : 'view'} mode`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="content">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Edit state' : 'View state'}
            </h2>
            <button
              onClick={toggleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Grid */}
      {!isEditing && (
        <div className="mb-8">
          <div className="overflow-x-auto border-2 border-blue-200 rounded-lg">
            <Grid onCellClick={handleCellClick} events={viewEvents} />
          </div>
        </div>
      )}

      {/* Edit Mode Grid */}
      {isEditing && (
        <div className="mb-8">
          <div className="overflow-x-auto border-2 border-orange-200 rounded-lg">
            <Grid onCellClick={handleCellClick} events={editEvents} />
          </div>
        </div>
      )}
    </div>
  );
} 