'use client';

import { useState, useRef } from 'react';
import React from 'react';
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
    availabilityId?: number;
  }>;
  isEditMode?: boolean;
  dynamicTimeRange?: boolean;
  selectedDate?: Date;
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
  onCardClick?: (card: {
    id: string;
    title: string;
    startDay: number;
    startHour: number;
    startSubCell: number;
    endDay: number;
    endHour: number;
    endSubCell: number;
    color?: string;
    availabilityId?: number;
  }) => void;
}

export default function Grid({ 
  onCellClick, 
  events = [], 
  isEditMode = false,
  dynamicTimeRange = false,
  selectedDate = new Date(),
  onCardCreate,
  onCardDelete,
  onCardClick
}: GridProps) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get the dates for the current week
  const getWeekDates = (date: Date): Date[] => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Adjust to Sunday
    const weekStart = new Date(d.setDate(diff));
    
    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + i);
      weekDates.push(dayDate);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(selectedDate);
  
  // Calculate dynamic time range based on events
  const calculateTimeRange = () => {
    if (!dynamicTimeRange || events.length === 0) {
      // Default range: 5 AM to 9 PM (17 hours)
      return {
        startHour: 5,
        endHour: 21,
        totalHours: 17
      };
    }

    // Find the earliest start time and latest end time from all events
    let earliestHour = Infinity;
    let latestHour = -Infinity;

    events.forEach(event => {
      earliestHour = Math.min(earliestHour, event.startHour);
      latestHour = Math.max(latestHour, event.endHour);
    });

    // Add some padding (1 hour before earliest, 1 hour after latest)
    const startHour = Math.max(0, earliestHour - 1);
    const endHour = Math.min(23, latestHour + 1);
    const totalHours = endHour - startHour + 1;

    return { startHour, endHour, totalHours };
  };

  const { startHour: gridStartHour, endHour: gridEndHour, totalHours } = calculateTimeRange();
  const hours = Array.from({ length: totalHours }, (_, i) => i + gridStartHour);
  
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

  // Helper function to format time range for card titles
  const formatTimeRange = (startHour: number, startSubCell: number) => {
    // Always add 30 minutes to the start time for the end time
    const startMinutesTotal = startHour * 60 + startSubCell * 15;
    const endMinutesTotal = startMinutesTotal + 30;
    const endHour = Math.floor(endMinutesTotal / 60);
    const endSubCell = Math.floor((endMinutesTotal % 60) / 15);

    let startTime = formatTime(startHour);
    let endTime = formatTime(endHour);

    // Always add minutes to the format
    const startMinutes = startSubCell * 15;
    const endMinutes = endSubCell * 15;
    startTime = startTime.replace(/(\d+)(\s*[AP]M)/, `$1:${startMinutes.toString().padStart(2, '0')}$2`);
    endTime = endTime.replace(/(\d+)(\s*[AP]M)/, `$1:${endMinutes.toString().padStart(2, '0')}$2`);

    return `${startTime} - ${endTime}`;
  };

  const getEventForSubCell = (day: number, hour: number, subCell: number) => {
    return events.find(event => 
      event.startDay === day && 
      event.startHour === hour && 
      event.startSubCell === subCell
    );
  };

  // Helper function to convert time to subcell index (updated for dynamic range)
  const timeToSubCellIndex = (hour: number, subCell: number) => {
    return (hour - gridStartHour) * 4 + subCell;
  };

  // Helper function to check if a time range overlaps with any existing events
  const hasOverlap = (day: number, startHour: number, startSubCell: number, endHour: number, endSubCell: number) => {
    const slotStartIndex = timeToSubCellIndex(startHour, startSubCell);
    const slotEndIndex = timeToSubCellIndex(endHour, endSubCell);
    const [minSlotIndex, maxSlotIndex] = slotStartIndex <= slotEndIndex ? [slotStartIndex, slotEndIndex] : [slotEndIndex, slotStartIndex];

    // Check for any overlap with existing events
    return events.some(event => {
      if (event.startDay !== day) return false;
      const eventStartIndex = timeToSubCellIndex(event.startHour, event.startSubCell);
      const eventEndIndex = timeToSubCellIndex(event.endHour, event.endSubCell);
      const [minEventIndex, maxEventIndex] = eventStartIndex <= eventEndIndex ? [eventStartIndex, eventEndIndex] : [eventEndIndex, eventStartIndex];
      // Overlap if ranges intersect
      return minSlotIndex <= maxEventIndex && maxSlotIndex >= minEventIndex;
    });
  };

  // Helper function to find available 2-subcell slots in a range
  const findAvailableSlots = (day: number, startHour: number, startSubCell: number, endHour: number, endSubCell: number) => {
    const startIndex = timeToSubCellIndex(startHour, startSubCell);
    const endIndex = timeToSubCellIndex(endHour, endSubCell);
    const [minIndex, maxIndex] = startIndex <= endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
    
    const availableSlots = [];
    
    // Look for consecutive 2-subcell slots, stepping by 2 to avoid overlap
    for (let i = minIndex; i <= maxIndex - 1; i += 2) { // Step by 2 instead of 1
      const slotStartHour = Math.floor(i / 4) + gridStartHour;
      const slotStartSubCell = i % 4;
      const slotEndHour = Math.floor((i + 1) / 4) + gridStartHour;
      const slotEndSubCell = (i + 1) % 4;
      
      // Check if this 2-subcell slot is available
      if (!hasOverlap(day, slotStartHour, slotStartSubCell, slotEndHour, slotEndSubCell)) {
        availableSlots.push({
          startHour: slotStartHour,
          startSubCell: slotStartSubCell,
          endHour: slotEndHour,
          endSubCell: slotEndSubCell,
        });
      }
    }
    
    return availableSlots;
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
    
    // Get the actual header height by finding the header element
    const headerElement = gridRef.current.querySelector('.grid-cols-8.bg-gradient-to-r');
    const headerHeight = headerElement ? headerElement.getBoundingClientRect().height : 0;
    const gridContentHeight = rect.height - headerHeight;
    const cellHeight = gridContentHeight / totalHours;
    
    const day = Math.floor(x / cellWidth) - 1; // -1 for time column
    const hour = Math.floor((y - headerHeight) / cellHeight) + gridStartHour;
    
    // Calculate sub-cell (4 per hour)
    const subCellY = (y - headerHeight) % cellHeight;
    const subCell = Math.floor(subCellY / (cellHeight / 4));

    // Clamp values
    const clampedDay = Math.max(0, Math.min(6, day));
    const clampedHour = Math.max(gridStartHour, Math.min(gridEndHour, hour));
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

    // Only create cards if we dragged to a different position
    if (startDay !== currentDay || startHour !== currentHour || startSubCell !== currentSubCell) {
      // Find available 2-subcell slots in the dragged range
      const availableSlots = findAvailableSlots(startDay, startHour, startSubCell, currentHour, currentSubCell);
      
      // Create cards for each available slot
      availableSlots.forEach((slot) => {
        const timeTitle = formatTimeRange(slot.startHour, slot.startSubCell);
        onCardCreate({
          title: timeTitle,
          startDay: startDay,
          startHour: slot.startHour,
          startSubCell: slot.startSubCell,
          endDay: startDay, // Same day for now
          endHour: slot.endHour,
          endSubCell: slot.endSubCell,
          color: 'bg-gradient-to-r from-blue-500 to-blue-600',
        });
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

    // Find available 2-subcell slots in the dragged range
    const availableSlots = findAvailableSlots(startDay, startHour, startSubCell, currentHour, currentSubCell);
    const previewCards: React.JSX.Element[] = [];

    availableSlots.forEach((slot, index) => {
      // Calculate position for this preview card
      const totalSubCellsInGrid = totalHours * 4; // totalHours * 4 sub-cells per hour
      const startIndex = timeToSubCellIndex(slot.startHour, slot.startSubCell);
      const endIndex = timeToSubCellIndex(slot.endHour, slot.endSubCell);
      const top = (startIndex / totalSubCellsInGrid) * 100;
      const height = ((endIndex - startIndex + 1) / totalSubCellsInGrid) * 100 + 0.1; // add a small overlap

      previewCards.push(
        <div 
          key={index}
          className="bg-blue-400/30 border-2 border-blue-500 border-dashed absolute pointer-events-none z-10 rounded-lg backdrop-blur-sm"
          style={{
            left: 0,
            right: 0,
            top: `${top}%`,
            height: `${height}%`,
          }}
        />
      );
    });

    return previewCards;
  };

  // Format date for header display
  const formatHeaderDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    return (
      <div className="text-center">
        <div className={`font-semibold ${isToday ? 'text-primary' : 'text-foreground'}`}>
          {days[date.getDay()]}
        </div>
        <div className={`text-xs ${isToday ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
          {date.getDate()}
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={gridRef}
      className="border border-border/50 rounded-2xl overflow-hidden relative h-full flex flex-col bg-white dark:bg-slate-800 shadow-lg"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Day Headers */}
      <div className="grid grid-cols-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 border-b border-border/50 flex-shrink-0">
        <div className="p-3 border-r border-border/50 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800"></div>
        {weekDates.map((date, index) => (
          <div
            key={index}
            className="p-3 border-r border-border/50 last:border-r-0"
          >
            {formatHeaderDate(date)}
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="grid grid-cols-8 relative flex-1">
        {/* Time Labels */}
        <div className="border-r border-border/50 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex-1 border-b border-border/30 flex items-center justify-end pr-3 text-xs text-muted-foreground min-h-0 font-medium"
            >
              {formatTime(hour)}
            </div>
          ))}
        </div>

        {/* Grid Cells */}
        {weekDates.map((date, dayIndex) => (
          <div key={dayIndex} className="border-r border-border/50 last:border-r-0 relative flex flex-col">
            {hours.map((hour) => (
              <div key={hour} className="flex-1 border-b border-border/30 min-h-0">
                <div className="grid grid-rows-4 h-full">
                  {[0, 1, 2, 3].map((subCell) => {
                    const event = getEventForSubCell(dayIndex, hour, subCell);
                    // Highlight if in drag range
                    let isInDragRange = false;
                    if (dragState?.isDragging && dragState.startDay === dayIndex) {
                      const startIdx = timeToSubCellIndex(dragState.startHour, dragState.startSubCell);
                      const endIdx = timeToSubCellIndex(dragState.currentHour, dragState.currentSubCell);
                      const cellIdx = timeToSubCellIndex(hour, subCell);
                      const [minIdx, maxIdx] = startIdx <= endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
                      isInDragRange = cellIdx >= minIdx && cellIdx <= maxIdx;
                    }
                    return (
                      <div
                        key={subCell}
                        className={`cursor-pointer transition-all duration-200 ${
                          event
                            ? ''
                            : isInDragRange
                              ? 'bg-blue-200/50 dark:bg-blue-800/30'
                              : dragState?.isDragging
                                ? ''
                                : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
                        }`}
                        onClick={() => handleSubCellClick(dayIndex, hour, subCell)}
                        onMouseDown={() => handleMouseDown(dayIndex, hour, subCell)}
                      >
                        {/* No event title in subcell, only in Card */}
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
                // Calculate top/height for absolute positioning using percentages
                // Use the actual grid dimensions (totalHours and gridStartHour) for consistent positioning
                const totalSubCells = totalHours * 4; // totalHours * 4 sub-cells per hour
                const startIndex = timeToSubCellIndex(event.startHour, event.startSubCell);
                const endIndex = timeToSubCellIndex(event.endHour, event.endSubCell);
                const top = (startIndex / totalSubCells) * 100;
                const height = ((endIndex - startIndex + 1) / totalSubCells) * 100 + 0.1; // add a small overlap
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
                    onClick={onCardClick ? () => onCardClick(event) : undefined}
                    style={{
                      left: 0,
                      right: 0,
                      top: `${top}%`,
                      height: `${height}%`,
                      zIndex: 20,
                    }}
                  />
                );
              })}
            
            {/* Drag Preview for this day */}
            {dragState?.isDragging && dragState.startDay === dayIndex && getDragPreview()}
          </div>
        ))}
      </div>
    </div>
  );
}
