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
  color = 'bg-blue-500',
  onDelete,
  style
}: CardProps) {
  return (
    <div 
      className={`${color} text-white rounded-sm p-0.5 text-xs font-medium shadow-sm border border-white/20 absolute group flex items-center justify-start`}
      style={style}
    >
      <div className="truncate text-xs">{title}</div>
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
