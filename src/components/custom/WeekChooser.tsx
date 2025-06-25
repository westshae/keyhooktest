'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WeekChooserProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  disabled?: boolean;
  disabledTooltip?: string;
}

export default function WeekChooser({ 
  selectedDate, 
  onDateChange, 
  disabled = false,
  disabledTooltip = "Please save your changes before changing weeks"
}: WeekChooserProps) {
  // Get the start of the week (Sunday) for the selected date
  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Adjust to Sunday
    return new Date(d.setDate(diff));
  };

  // Get the end of the week (Saturday) for the selected date
  const getWeekEnd = (date: Date): Date => {
    const weekStart = getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    if (disabled) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    onDateChange(newDate);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    if (disabled) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    onDateChange(newDate);
  };

  // Go to current week
  const goToCurrentWeek = () => {
    if (disabled) return;
    onDateChange(new Date());
  };

  const weekStart = getWeekStart(selectedDate);
  const weekEnd = getWeekEnd(selectedDate);
  const isCurrentWeek = getWeekStart(new Date()).getTime() === weekStart.getTime();

  return (
    <div className={`flex items-center justify-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-border/50 shadow-sm ${disabled ? 'opacity-60' : ''}`}>
      <Button
        onClick={goToPreviousWeek}
        variant="outline"
        size="sm"
        className="w-10 h-10 p-0"
        disabled={disabled}
        title={disabled ? disabledTooltip : "Previous week"}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">
            {formatDate(weekStart)} - {formatDate(weekEnd)}
          </span>
        </div>
        
        {!isCurrentWeek && (
          <Button
            onClick={goToCurrentWeek}
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            disabled={disabled}
            title={disabled ? disabledTooltip : "Go to current week"}
          >
            Today
          </Button>
        )}
      </div>

      <Button
        onClick={goToNextWeek}
        variant="outline"
        size="sm"
        className="w-10 h-10 p-0"
        disabled={disabled}
        title={disabled ? disabledTooltip : "Next week"}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
} 