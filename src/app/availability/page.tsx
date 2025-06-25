'use client';

import { useState } from 'react';
import Grid from '@/components/custom/Grid';

interface Card {
  id: string;
  title: string;
  startDay: number;
  startHour: number;
  startSubCell: number;
  endDay: number;
  endHour: number;
  endSubCell: number;
  color?: string;
}

export default function Availability() {
  const [isEditing, setIsEditing] = useState(false);
  const [viewEvents, setViewEvents] = useState<Card[]>([]);
  const [editEvents, setEditEvents] = useState<Card[]>([]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCellClick = (day: number, hour: number, subCell: number) => {
    console.log(`Clicked: Day ${day}, Hour ${hour}, Sub-cell ${subCell} in ${isEditing ? 'edit' : 'view'} mode`);
  };

  const handleCardCreate = (cardData: Omit<Card, 'id'>) => {
    const newCard: Card = {
      ...cardData,
      id: `card-${Date.now()}-${Math.random()}`,
    };
    
    if (isEditing) {
      setEditEvents(prev => [...prev, newCard]);
    } else {
      setViewEvents(prev => [...prev, newCard]);
    }
  };

  const handleCardDelete = (cardId: string) => {
    if (isEditing) {
      setEditEvents(prev => prev.filter(card => card.id !== cardId));
    } else {
      setViewEvents(prev => prev.filter(card => card.id !== cardId));
    }
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
            <Grid 
              onCellClick={handleCellClick} 
              events={viewEvents}
              isEditMode={false}
            />
          </div>
        </div>
      )}

      {/* Edit Mode Grid */}
      {isEditing && (
        <div className="mb-8">
          <div className="overflow-x-auto border-2 border-orange-200 rounded-lg">
            <Grid 
              onCellClick={handleCellClick} 
              events={editEvents}
              isEditMode={true}
              onCardCreate={handleCardCreate}
              onCardDelete={handleCardDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
} 