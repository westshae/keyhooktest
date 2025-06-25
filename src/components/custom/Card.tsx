'use client';

interface CardProps {
  title: string;
  startDay: number;
  startHour: number;
  startSubCell: number;
  endDay: number;
  endHour: number;
  endSubCell: number;
  color?: string;
  onDelete?: () => void;
  style?: React.CSSProperties;
}

export default function Card({ 
  title, 
  startDay, 
  startHour, 
  startSubCell, 
  endHour, 
  endSubCell, 
  color = 'bg-blue-500',
  onDelete,
  style
}: CardProps) {
  const formatTime = (hour: number, subCell: number) => {
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const minutes = subCell * 15;
    return minutes === 0
      ? `${hour12} ${ampm}`
      : `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div 
      className={`${color} text-white rounded-sm p-1 text-xs font-medium shadow-sm border border-white/20 absolute group`}
      style={style}
    >
      <div className="truncate">{title}</div>
      <div className="text-xs opacity-75">
        {formatTime(startHour, startSubCell)} - {formatTime(endHour, endSubCell)}
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          ×
        </button>
      )}
    </div>
  );
}
