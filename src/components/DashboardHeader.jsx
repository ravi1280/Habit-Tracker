import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { format, addMonths, subMonths } from 'date-fns';
import { motion } from 'framer-motion';
import WeeklyCalendar from './WeeklyCalendar';

const DashboardHeader = () => {
    const { habits, getHabitDate } = useHabits();
    const todayStr = getHabitDate();

    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    // Motivation Quotes
    const quotes = [
        "New beginnings are in order, and you are bound to feel some level of excitement as new chances come your way.", // Jan
        "It is not enough to stare up the steps, we must step up the stairs.", // Feb
        "Success is not final, failure is not fatal: it is the courage to continue that counts.", // Mar
        "Believe you can and you're halfway there.", // Apr
        "Don't watch the clock; do what it does. Keep going.", // May
        "The only way to do great work is to love what you do.", // Jun
        "You are never too old to set another goal or to dream a new dream.", // Jul
        "Act as if what you do makes a difference. It does.", // Aug
        "Success usually comes to those who are too busy to be looking for it.", // Sep
        "The future depends on what you do today.", // Oct
        "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.", // Nov
        "The only limit to our realization of tomorrow will be our doubts of today." // Dec
    ];

    const currentQuote = quotes[currentMonth.getMonth()];

    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.completedDates.includes(todayStr)).length;
    const progress = totalHabits === 0 ? 0 : (completedToday / totalHabits) * 100;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    // Circular Progress Config
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col gap-lg">
            <div className="glass-panel flex items-center justify-between" style={{ padding: 'var(--spacing-lg)' }}>
                <div className="flex flex-col gap-xs">
                    <span className="text-sm text-muted font-bold uppercase tracking-wider">{format(new Date(), 'EEEE, MMMM do')}</span>
                    <h1 className="text-xl" style={{ fontSize: '1.75rem' }}>{greeting}, User</h1>
                    <p className="text-muted">
                        You've completed <span className="font-bold" style={{ color: 'var(--color-primary)' }}>{completedToday}</span> of <span className="font-bold">{totalHabits}</span> habits today.
                    </p>
                </div>

                <div className="flex items-center gap-lg">
                    <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                        <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
                            <circle
                                cx="45"
                                cy="45"
                                r={radius}
                                stroke="var(--color-text-secondary)"
                                strokeWidth="8"
                                fill="transparent"
                                opacity="0.1"
                            />
                            <motion.circle
                                cx="45"
                                cy="45"
                                r={radius}
                                stroke="var(--color-primary)"
                                strokeWidth="8"
                                fill="transparent"
                                strokeLinecap="round"
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                style={{ strokeDasharray: circumference }}
                            />
                        </svg>
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontWeight: 'bold',
                            fontSize: '1.1rem'
                        }}>
                            {Math.round(progress)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Split Layout: Calendar & Motivation */}
            <div className="grid-habits" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
                {/* Calendar Section */}
                <div className="glass-panel" style={{ padding: 'var(--spacing-lg)' }}>
                    <WeeklyCalendar
                        currentMonth={currentMonth}
                        onNextMonth={nextMonth}
                        onPrevMonth={prevMonth}
                    />
                </div>

                {/* Motivation Quote Section */}
                <div className="glass-panel flex flex-col justify-center relative overflow-hidden" style={{ padding: 'var(--spacing-lg)', minHeight: '200px' }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(223, 255, 0, 0.05) 0%, transparent 100%)',
                        zIndex: 0
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <span className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Monthly Motivation</span>
                        <h3 className="text-lg font-bold italic" style={{ lineHeight: '1.5', marginBottom: 'var(--spacing-md)' }}>
                            "{currentQuote}"
                        </h3>
                        <div className="flex items-center gap-xs">
                            <div style={{ width: '20px', height: '2px', backgroundColor: 'var(--color-primary)' }} />
                            <span className="text-sm font-medium text-muted">{format(currentMonth, 'MMMM')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
