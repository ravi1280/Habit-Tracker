import React, { useState } from 'react';
import { Check, Trash2, Flame, Tag } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import confetti from 'canvas-confetti';

const HabitItem = ({ habit }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { toggleHabitCompletion, deleteHabit, getHabitStats, getHabitDate } = useHabits();
    const todayStr = getHabitDate();
    const isCompletedToday = habit.completedDates.includes(todayStr);
    const { currentStreak } = getHabitStats(habit);
    const todayCount = isCompletedToday ? 1 : 0;
    const todayTotal = 1; // per current model, one completion per day

    const frequencyLabel = (() => {
        const t = habit?.frequency?.type || 'daily';
        if (t === 'daily') return 'Daily';
        if (t === 'weekly') return 'Weekly';
        return t.charAt(0).toUpperCase() + t.slice(1);
    })();

    // Utility: add alpha to hex/rgb colors for subtle tints
    const withAlpha = (color, alpha) => {
        if (!color || typeof color !== 'string') return color;
        const a = Math.max(0, Math.min(1, alpha));
        // Hex formats: #RGB, #RRGGBB, #RRGGBBAA
        if (color.startsWith('#')) {
            let hex = color.slice(1);
            if (hex.length === 3) {
                hex = hex.split('').map((ch) => ch + ch).join('');
            }
            if (hex.length === 6 || hex.length === 8) {
                const six = hex.slice(0, 6);
                const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
                return `#${six}${alphaHex}`;
            }
            return color;
        }
        // rgb/rgba
        const m = color.match(/rgba?\s*\((\s*\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\)/i);
        if (m) {
            const [, r, g, b] = m;
            return `rgba(${parseInt(r, 10)}, ${parseInt(g, 10)}, ${parseInt(b, 10)}, ${a})`;
        }
        return color; // fallback (hsl, named colors)
    };

    const handleToggle = (e) => {
        // Trigger confetti if marking as complete (not unmarking)
        if (!isCompletedToday) {
            const rect = e.target.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                origin: { x, y },
                particleCount: 60,
                spread: 70,
                colors: [habit.color, '#ffffff'],
                zIndex: 9999,
                disableForReducedMotion: true
            });
        }
        toggleHabitCompletion(habit.id);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass-panel relative overflow-hidden group flex flex-col"
            style={{
                padding: '1.25rem',
                background: `linear-gradient(135deg, ${withAlpha(habit.color, 0.06)}, transparent 65%)`,
                backgroundColor: 'var(--card-bg)',
                border: `1px solid ${withAlpha(habit.color, 0.35)}`,
                borderRadius: '1.5rem',
                transition: 'box-shadow 0.25s ease, transform 0.2s ease',
                boxShadow: `0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.12)`
            }}
            whileHover={{ y: -2, boxShadow: `0 2px 8px rgba(0,0,0,0.08), 0 16px 40px ${withAlpha(habit.color, 0.25)}` }}
        >
            {/* Background Glow Effect */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{
                    background: `linear-gradient(135deg, ${withAlpha(habit.color, 0.35)}, transparent)`,
                    pointerEvents: 'none'
                }}
            />

            {/* Top row: title/description (left), status + complete (right) */}
            <div className="flex items-center justify-between gap-md relative z-10">
                <div className="flex flex-col gap-1">
                    <span className="text-xl font-bold" style={{ color: 'var(--color-text-main)' }}>
                        {habit.name}
                    </span>
                    {habit.description && (
                        <span className="text-sm text-muted" style={{ opacity: 0.9 }}>{habit.description}</span>
                    )}
                </div>

                <div className="flex items-center gap-md">
                    {/* Today count */}
                    {/* <span className="text-sm font-semibold" style={{ color: isCompletedToday ? '#22c55e' : 'var(--color-text-secondary)' }}>
                        {todayCount}/{todayTotal}
                    </span> */}

                    {/* Complete button on right */}
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={handleToggle}
                        className={clsx('flex items-center justify-center transition-all duration-300')}
                        style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '9999px',
                            backgroundColor: isCompletedToday ? habit.color : withAlpha(habit.color, 0.15),
                            color: isCompletedToday ? '#111' : habit.color,
                            border: `1px solid ${withAlpha(habit.color, 0.4)}`,
                            boxShadow: isCompletedToday ? `0 0 0 4px ${withAlpha(habit.color, 0.14)}` : 'none'
                        }}
                        title={isCompletedToday ? 'Completed' : 'Mark complete'}
                    >
                        {isCompletedToday ? (
                            <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
                                <Check size={18} strokeWidth={3} />
                            </motion.div>
                        ) : (
                            <div style={{ width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: habit.color }} />
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Divider between rows */}
            <div
                className="relative"
                style={{
                    marginTop: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-sm)'
                }}
            >
                <div
                    className="absolute left-[calc(3.5rem+var(--spacing-lg))] right-0"
                    style={{
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${withAlpha(habit.color, 0.25)}, transparent)`
                    }}
                />
            </div>

            {/* Bottom row: chips + delete, aligned left to right */}
            <div className="flex items-center justify-between relative z-10" style={{ marginTop: 'var(--spacing-sm)' }}>
                <div className="flex items-center gap-3">
                    {/* Streak Badge */}
                    <div
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors",
                            "bg-white/5 border-white/10 text-gray-500"
                        )}
                    >
                        <Flame
                            size={24}
                            style={{
                                color: currentStreak > 0 ? '#f97316' : '#6b7280', // orange-500 : gray-500
                                filter: currentStreak > 0 ? 'drop-shadow(0 2px 4px rgba(249, 115, 22, 0.3))' : 'none'
                            }}
                            fill={currentStreak > 0 ? "currentColor" : "none"}
                        />&nbsp;
                        <span className="text-xs font-medium">
                            <span className={clsx("font-bold mr-1", currentStreak > 0 ? "text-orange-100" : "text-gray-500")}>
                                {currentStreak}
                            </span> &nbsp;
                            Day Streak
                        </span>
                    </div>
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
                        'btn-ghost transition-all duration-200',
                        showDeleteConfirm ? 'opacity-100 text-red-500 scale-105' : 'opacity-80 text-muted'
                    )}
                    style={{
                        padding: 'calc(var(--spacing-sm) + 2px)',
                        borderRadius: '9999px',
                        backgroundColor: showDeleteConfirm ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
                    }}
                    title={showDeleteConfirm ? 'Click again to delete' : 'Delete habit'}
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </motion.div>
    );
};

export default HabitItem;
