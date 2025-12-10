import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "./utils";

interface SimpleCalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
}

export function SimpleCalendar({ selected, onSelect, className }: SimpleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of week (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = monthStart.getDay();
  // Adjust for Monday as first day (Spanish locale)
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Get days from previous month to fill the first week
  const previousMonthDays = [];
  if (adjustedFirstDay > 0) {
    const prevMonthEnd = endOfMonth(subMonths(currentMonth, 1));
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      previousMonthDays.push(new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), prevMonthEnd.getDate() - i));
    }
  }

  // Get days from next month to fill the last week
  const totalCells = previousMonthDays.length + daysInMonth.length;
  const remainingCells = 42 - totalCells; // 6 weeks * 7 days
  const nextMonthDays = [];
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push(new Date(monthEnd.getFullYear(), monthEnd.getMonth(), monthEnd.getDate() + i));
  }

  const allDays = [...previousMonthDays, ...daysInMonth, ...nextMonthDays];

  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    if (onSelect) {
      onSelect(date);
    }
  };

  return (
    <div className={cn("w-full", className)} style={{ maxWidth: '350px', margin: '0 auto' }}>
      {/* Header with month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePreviousMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '2px' }}>
        {weekDays.map((day, index) => (
          <div
            key={index}
            style={{ textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#6b7280', padding: '2px 0' }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {allDays.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selected && isSameDay(day, selected);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              style={{
                width: '40px',
                height: '40px',
                padding: '0',
                fontSize: '12px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: !isCurrentMonth ? '#d1d5db' : isSelected ? 'white' : '#111827',
                backgroundColor: isSelected ? '#2563eb' : isToday ? '#dbeafe' : 'transparent',
                fontWeight: isSelected || isToday ? '600' : '400',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = isToday ? '#dbeafe' : 'transparent';
                }
              }}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

