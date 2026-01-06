import React, { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    isSameMonth
} from 'date-fns';
import { motion } from 'framer-motion';

const WeeklyCalendar = ({ currentMonth, onNextMonth, onPrevMonth }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="flex flex-col gap-sm w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-md font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
                <div className="flex gap-xs">
                    <button
                        onClick={onPrevMonth}
                        className="btn-ghost p-1 rounded-full"
                        style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--card-bg)' }}
                    >
                        &lt;
                    </button>
                    <button
                        onClick={onNextMonth}
                        className="btn-ghost p-1 rounded-full"
                        style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--card-bg)' }}
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-xs" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {/* Day Headers */}
                {weekDays.map(day => (
                    <div key={day} className="text-center text-xs font-bold text-muted uppercase tracking-wider py-1" style={{ fontSize: '0.65rem' }}>
                        {day}
                    </div>
                ))}

                {/* Days */}
                {calendarDays.map((date) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isCurrentMonth = isSameMonth(date, monthStart);
                    const isToday = isSameDay(date, new Date());

                    return (
                        <motion.button
                            key={date.toString()}
                            onClick={() => setSelectedDate(date)}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center justify-center relative"
                            style={{
                                aspectRatio: '1/1',
                                borderRadius: '8px',
                                backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                                color: isSelected ? 'black' : (isCurrentMonth ? 'var(--color-text-main)' : 'var(--color-text-secondary)'),
                                border: isSelected ? 'none' : (isToday ? '1px solid var(--color-primary)' : '1px solid transparent'),
                                opacity: isCurrentMonth ? 1 : 0.3,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.8rem',
                                padding: '2px'
                            }}
                        >
                            <span className="font-bold">
                                {format(date, 'd')}
                            </span>
                            {isToday && !isSelected && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '2px',
                                    width: '3px',
                                    height: '3px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-primary)'
                                }} />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default WeeklyCalendar;
