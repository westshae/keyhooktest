'use client';

import { X } from 'lucide-react';

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
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function Card({ 
  title, 
  color = 'bg-gradient-to-r from-blue-500 to-blue-600',
  onDelete,
  onClick,
  style
}: CardProps) {
  return (
    <div 
      className={`${color} text-white rounded-xl text-xs font-medium shadow-lg hover:shadow-xl absolute group flex items-center justify-start border border-white/20 backdrop-blur-sm transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:shadow-glow-blue' : ''}`}
      style={style}
      onClick={onClick}
    >
      <div className="truncate text-xs flex-1 pl-3 py-1.5 font-medium">{title}</div>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card's onClick
            onDelete();
          }}
          className="bg-red-500/90 hover:bg-red-600 text-white min-w-[1.5rem] h-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-r-xl rounded-l-none text-xs font-bold p-0 m-0 border-0 hover:scale-105"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
