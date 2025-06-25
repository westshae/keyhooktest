'use client';

import { useState, useRef } from 'react';
import Card from './Card';

interface GridProps {
  onCellClick?: (day: number, hour: number, subCell: number) => void;
  events?: Array<{
    id: string;
    title: string;
    startDay: number;
    startHour: number;
    startSubCell: number;
    endDay: number;
    endHour: number;
    endSubCell: number;
    color?: string;
  }>;
  isEditMode?: boolean;
  onCardCreate?: (card: {
    title: string;
    startDay: number;
    startHour: number;
    startSubCell: number;
    endDay: number;
    endHour: number;
    endSubCell: number;
    color?: string;
  }) => void;
  onCardDelete?: (cardId: string) => void;
}

export default function Grid({ 
  onCellClick, 
  events = [], 
  isEditMode = false,
  onCardCreate,
  onCardDelete 
}: GridProps) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 20 }, (_, i) => i + 5); // Start from 5 AM, 20 hours total
  
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    startDay: number;
    startHour: number;
    startSubCell: number;
    currentDay: number;
    currentHour: number;
    currentSubCell: number;
  } | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  const formatTime = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  const getEventForSubCell = (day: number, hour: number, subCell: number) => {
    return events.find(event => 
      event.startDay === day && 
      event.startHour === hour && 
      event.startSubCell === subCell
    );
  };

  const handleSubCellClick = (day: number, hour: number, subCell: number) => {
    if (onCellClick) {
      onCellClick(day, hour, subCell);
    }
  };

  const handleMouseDown = (day: number, hour: number, subCell: number) => {
    if (!isEditMode) return;
    
    setDragState({
      isDragging: true,
      startDay: day,
      startHour: hour,
      startSubCell: subCell,
      currentDay: day,
      currentHour: hour,
      currentSubCell: subCell,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState?.isDragging || !gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate which cell we're over
    const cellWidth = rect.width / 8; // 8 columns (time + 7 days)
    const cellHeight = rect.height / 20; // 20 hours
    
    const day = Math.floor(x / cellWidth) - 1; // -1 for time column
    const hour = Math.floor(y / cellHeight) + 5; // +5 because we start from 5 AM
    
    // Calculate sub-cell (4 per hour)
    const subCellY = y % cellHeight;
    const subCell = Math.floor(subCellY / (cellHeight / 4));

    // Clamp values
    const clampedDay = Math.max(0, Math.min(6, day));
    const clampedHour = Math.max(5, Math.min(24, hour));
    const clampedSubCell = Math.max(0, Math.min(3, subCell));

    setDragState(prev => prev ? {
      ...prev,
      currentDay: clampedDay,
      currentHour: clampedHour,
      currentSubCell: clampedSubCell,
    } : null);
  };

  const handleMouseUp = () => {
    if (!dragState?.isDragging || !onCardCreate) return;

    const { startDay, startHour, startSubCell, currentDay, currentHour, currentSubCell } = dragState;

    // Only create card if we dragged to a different position
    if (startDay !== currentDay || startHour !== currentHour || startSubCell !== currentSubCell) {
      // Determine start and end positions
      const startTime = startHour * 4 + startSubCell;
      const endTime = currentHour * 4 + currentSubCell;
      
      const [startHourFinal, startSubCellFinal] = startTime <= endTime 
        ? [startHour, startSubCell] 
        : [currentHour, currentSubCell];
      
      const [endHourFinal, endSubCellFinal] = startTime <= endTime 
        ? [currentHour, currentSubCell] 
        : [startHour, startSubCell];

      onCardCreate({
        title: 'New Event',
        startDay: startDay,
        startHour: startHourFinal,
        startSubCell: startSubCellFinal,
        endDay: startDay, // Same day for now
        endHour: endHourFinal,
        endSubCell: endSubCellFinal,
        color: 'bg-blue-500',
      });
    }

    setDragState(null);
  };

  const getDragPreview = () => {
    if (!dragState?.isDragging) return null;

    const { startDay, startHour, startSubCell, currentDay, currentHour, currentSubCell } = dragState;
    
    // Only show preview if we're dragging to a different position
    if (startDay === currentDay && startHour === currentHour && startSubCell === currentSubCell) {
      return null;
    }

    const startTime = startHour * 4 + startSubCell;
    const endTime = currentHour * 4 + currentSubCell;
    
    const [startHourFinal, startSubCellFinal] = startTime <= endTime 
      ? [startHour, startSubCell] 
      : [currentHour, currentSubCell];
    
    const [endHourFinal, endSubCellFinal] = startTime <= endTime 
      ? [currentHour, currentSubCell] 
      : [startHour, startSubCell];

    return (
      <div 
        className="bg-blue-300/50 border-2 border-blue-500 border-dashed absolute pointer-events-none z-10"
        style={{
          gridRow: `${startSubCellFinal + 1} / ${endSubCellFinal + 2}`,
          gridColumn: `${startDay + 2} / ${startDay + 3}`,
        }}
      />
    );
  };

  return (
    <div 
      ref={gridRef}
      className="border border-gray-300 rounded-lg overflow-hidden relative"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Day Headers */}
      <div className="grid grid-cols-8 bg-gray-100 border-b border-gray-300">
        <div className="p-2 border-r border-gray-300 bg-gray-50"></div>
        {days.map((day) => (
          <div
            key={day}
            className="p-2 text-center font-medium text-gray-700 border-r border-gray-300 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="grid grid-cols-8 relative">
        {/* Time Labels */}
        <div className="border-r border-gray-300">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-8 border-b border-gray-200 flex items-center justify-end pr-2 text-xs text-gray-500"
            >
              {formatTime(hour)}
            </div>
          ))}
        </div>

        {/* Grid Cells */}
        {days.map((_, dayIndex) => (
          <div key={dayIndex} className="border-r border-gray-300 last:border-r-0 relative h-full">
            {hours.map((hour) => (
              <div key={hour} className="h-8 border-b border-gray-200">
                <div className="grid grid-rows-4 h-full">
                  {[0, 1, 2, 3].map((subCell) => {
                    const event = getEventForSubCell(dayIndex, hour, subCell);
                    return (
                      <div
                        key={subCell}
                        className={`cursor-pointer transition-colors ${
                          event
                            ? `${event.color || 'bg-blue-500'} text-white`
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleSubCellClick(dayIndex, hour, subCell)}
                        onMouseDown={() => handleMouseDown(dayIndex, hour, subCell)}
                      >
                        {event && (
                          <div className="p-0.5 text-xs font-medium truncate">
                            {event.title}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {/* Cards for this day */}
            {events
              .filter(event => event.startDay === dayIndex)
              .map(event => {
                // Calculate top/height for absolute positioning
                const hourHeight = 32; // h-8 = 32px
                const subCellHeight = hourHeight / 4; // 8px
                const startIndex = (event.startHour - 5) * 4 + event.startSubCell;
                const endIndex = (event.endHour - 5) * 4 + event.endSubCell;
                const top = startIndex * subCellHeight;
                const height = (endIndex - startIndex + 1) * subCellHeight;
                return (
                  <Card
                    key={event.id}
                    title={event.title}
                    startDay={event.startDay}
                    startHour={event.startHour}
                    startSubCell={event.startSubCell}
                    endDay={event.endDay}
                    endHour={event.endHour}
                    endSubCell={event.endSubCell}
                    color={event.color}
                    onDelete={onCardDelete ? () => onCardDelete(event.id) : undefined}
                    style={{
                      left: 0,
                      right: 0,
                      top,
                      height,
                      zIndex: 20,
                    }}
                  />
                );
              })}
          </div>
        ))}
      </div>

      {/* Drag Preview */}
      {getDragPreview()}
    </div>
  );
}
