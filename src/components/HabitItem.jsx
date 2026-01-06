import React, { useState } from 'react';
import { Check, Trash2, Flame } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const HabitItem = ({ habit }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { toggleHabitCompletion, deleteHabit, getHabitStats, getHabitDate } = useHabits();
    const todayStr = getHabitDate();
    const isCompletedToday = habit.completedDates.includes(todayStr);
    const { currentStreak } = getHabitStats(habit);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel flex items-center justify-between relative overflow-hidden group"
            style={{
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-xl)',
                transition: 'all 0.3s ease'
            }}
            whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
        >
            {/* Background Glow Effect */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{
                    background: `linear-gradient(135deg, ${habit.color}, transparent)`,
                    pointerEvents: 'none'
                }}
            />

            <div className="flex items-center gap-lg relative z-10">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className={clsx(
                        "flex items-center justify-center",
                        "transition-all duration-300"
                    )}
                    style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        borderRadius: '50%',
                        backgroundColor: isCompletedToday ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                        color: isCompletedToday ? 'black' : 'var(--color-text-secondary)',
                        border: isCompletedToday ? 'none' : '2px solid var(--card-border)',
                        boxShadow: isCompletedToday ? '0 0 20px var(--color-primary)' : 'none'
                    }}
                >
                    {isCompletedToday ? (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                        >
                            <Check size={28} strokeWidth={3} />
                        </motion.div>
                    ) : (
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: habit.color, opacity: 0.5 }} />
                    )}
                </motion.button>

                <div className="flex flex-col gap-xs">
                    <span className="text-xl font-bold" style={{
                        textDecoration: isCompletedToday ? 'line-through' : 'none',
                        color: isCompletedToday ? 'var(--color-text-secondary)' : 'var(--color-text-main)',
                        opacity: isCompletedToday ? 0.5 : 1,
                        transition: 'all 0.3s ease'
                    }}>
                        {habit.name}
                    </span>
                    {habit.description && (
                        <span className="text-sm text-muted">{habit.description}</span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-xl relative z-10">
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-xs">
                        <Flame
                            size={20}
                            fill={currentStreak > 0 ? 'var(--color-primary)' : 'none'}
                            color={currentStreak > 0 ? 'var(--color-primary)' : 'var(--color-text-secondary)'}
                        />
                        <span className="font-bold text-lg">{currentStreak}</span>
                    </div>
                    <span className="text-xs text-muted font-bold uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>Streak</span>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (showDeleteConfirm) {
                            deleteHabit(habit.id);
                        } else {
                            setShowDeleteConfirm(true);
                        }
                    }}
                    onMouseLeave={() => setShowDeleteConfirm(false)}
                    className={clsx(
                        "btn-ghost transition-all duration-300",
                        showDeleteConfirm ? "opacity-100 text-red-500 scale-110" : "opacity-0 group-hover:opacity-100 text-muted"
                    )}
                    style={{
                        padding: 'var(--spacing-sm)',
                        borderRadius: '50%',
                        backgroundColor: showDeleteConfirm ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
                    }}
                    title={showDeleteConfirm ? "Click again to delete" : "Delete habit"}
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </motion.div>
    );
};

export default HabitItem;
