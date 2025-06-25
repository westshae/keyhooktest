'use client';

interface GridProps {
  onCellClick?: (day: number, hour: number) => void;
  events?: Array<{
    day: number;
    hour: number;
    duration: number;
    title: string;
    color?: string;
  }>;
}

export default function Grid({ onCellClick, events = [] }: GridProps) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 20 }, (_, i) => i + 5); // Start from 5 AM, 20 hours total

  const formatTime = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  const getEventForCell = (day: number, hour: number) => {
    return events.find(event => event.day === day && event.hour === hour);
  };

  const handleCellClick = (day: number, hour: number) => {
    if (onCellClick) {
      onCellClick(day, hour);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
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
      <div className="grid grid-cols-8">
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
          <div key={dayIndex} className="border-r border-gray-300 last:border-r-0">
            {hours.map((hour) => {
              const event = getEventForCell(dayIndex, hour);
              return (
                <div
                  key={hour}
                  className={`h-8 border-b border-gray-200 cursor-pointer transition-colors ${
                    event
                      ? `${event.color || 'bg-blue-500'} text-white`
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCellClick(dayIndex, hour)}
                >
                  {event && (
                    <div className="p-1 text-xs font-medium truncate">
                      {event.title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
