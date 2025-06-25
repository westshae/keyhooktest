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
      className={`${color} text-white rounded-sm text-xs font-medium shadow-sm absolute group flex items-center justify-start border border-white`}
      style={style}
    >
      <div className="truncate text-xs flex-1 pl-2 py-0.5">{title}</div>
      {onDelete && (
        <button
          onClick={onDelete}
          className="bg-red-500 text-white min-w-[1.5rem] h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-r-sm rounded-l-none text-xs font-bold p-0 m-0 border-0"
        >
          ×
        </button>
      )}
    </div>
  );
}
