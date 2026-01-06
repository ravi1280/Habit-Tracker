import React from 'react';
import { useHabits } from '../context/HabitContext';
import { format, subDays, eachDayOfInterval, isSameDay, startOfWeek, subWeeks, subHours } from 'date-fns';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Flame, Trophy, Activity } from 'lucide-react';

const ProgressView = () => {
    const { habits, getHabitStats } = useHabits();
    // Shift "today" by 6 hours to match habit logic
    const today = subHours(new Date(), 6);

    // Prepare data for the chart (Last 7 days completion)
    const last7Days = eachDayOfInterval({
        start: subDays(today, 6),
        end: today,
    });

    const chartData = last7Days.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const completedCount = habits.filter(h => h.completedDates.includes(dateStr)).length;
        return {
            name: format(date, 'EEE'), // Mon, Tue, etc.
            completed: completedCount,
            fullDate: format(date, 'MMM d'),
        };
    });

    if (habits.length === 0) {
        return (
            <div className="glass-panel flex flex-col items-center justify-center" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                <p className="text-muted">No habits to show progress for.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-lg">
            {/* Weekly Overview Chart */}
            <div className="glass-panel" style={{ padding: 'var(--spacing-lg)' }}>
                <h3 className="text-lg" style={{ marginBottom: 'var(--spacing-md)' }}>Weekly Overview</h3>
                <div style={{ height: '200px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    background: 'var(--color-surface)',
                                    color: 'var(--color-text-main)'
                                }}
                            />
                            <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="var(--color-primary)" opacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Individual Habit Performance Cards */}
            <div className="flex flex-col gap-md">
                <h3 className="text-lg">Habit Performance</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-md)' }}>
                    {habits.map((habit) => {
                        const { currentStreak, totalCompleted } = getHabitStats(habit);
                        const last30Days = eachDayOfInterval({ start: subDays(today, 29), end: today });
                        const completedLast30 = last30Days.filter(d => habit.completedDates.includes(format(d, 'yyyy-MM-dd'))).length;
                        const completionRate = Math.round((completedLast30 / 30) * 100);

                        return (
                            <div key={habit.id} className="glass-panel flex flex-col gap-md" style={{ padding: 'var(--spacing-lg)' }}>
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-sm">
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: habit.color }}></div>
                                        <h4 className="font-bold text-lg">{habit.name}</h4>
                                    </div>
                                    <div className="flex items-center gap-xs text-sm font-bold" style={{ color: habit.color, backgroundColor: `${habit.color}15`, padding: '4px 8px', borderRadius: 'var(--radius-full)' }}>
                                        <Activity size={14} />
                                        <span>{completionRate}%</span>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="flex gap-lg" style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: 'var(--spacing-md)' }}>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>Streak</span>
                                        <div className="flex items-center gap-xs">
                                            <Flame size={18} fill={currentStreak > 0 ? 'orange' : 'none'} color={currentStreak > 0 ? 'orange' : 'var(--color-text-secondary)'} />
                                            <span className="font-bold text-lg">{currentStreak}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>Total</span>
                                        <div className="flex items-center gap-xs">
                                            <Trophy size={18} className="text-yellow-500" color="#eab308" />
                                            <span className="font-bold text-lg">{totalCompleted}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contribution Chart */}
                                <div className="flex flex-col gap-xs">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs text-muted">Last 3 Months</span>
                                    </div>
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateRows: 'repeat(7, 1fr)',
                                            gridAutoFlow: 'column',
                                            gap: '3px',
                                            height: '84px', // 7 rows * (9px height + 3px gap) approx
                                        }}
                                    >
                                        {eachDayOfInterval({
                                            start: startOfWeek(subWeeks(today, 16), { weekStartsOn: 1 }),
                                            end: today
                                        }).map((date) => {
                                            const dateStr = format(date, 'yyyy-MM-dd');
                                            const isCompleted = habit.completedDates.includes(dateStr);
                                            const isTodayDate = isSameDay(date, today);

                                            return (
                                                <div
                                                    key={dateStr}
                                                    title={`${format(date, 'MMM d, yyyy')}: ${isCompleted ? 'Completed' : 'Missed'}`}
                                                    style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '2px',
                                                        backgroundColor: isCompleted ? habit.color : 'var(--color-surface)',
                                                        border: isCompleted ? 'none' : '1px solid var(--color-border)',
                                                        opacity: isCompleted ? 1 : 0.5,
                                                        boxShadow: isTodayDate ? `0 0 0 1px ${habit.color}` : 'none',
                                                        transition: 'all 0.1s'
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProgressView;
