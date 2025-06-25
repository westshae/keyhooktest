'use client';

import { useState } from 'react';

export default function Availability() {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
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
          <div className="p-4 border rounded bg-gray-50">
            <p className="text-lg">
              Current state: <strong>{isEditing ? 'Editing' : 'Viewing'}</strong>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {isEditing 
                ? 'You are currently in edit mode. Click "Save" to return to view mode.' 
                : 'You are currently in view mode. Click "Edit" to enter edit mode.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 