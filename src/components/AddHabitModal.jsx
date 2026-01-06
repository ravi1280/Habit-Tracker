import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#6366f1', '#ef4444', '#22c55e', '#eab308', '#ec4899', '#8b5cf6', '#06b6d4'];

const AddHabitModal = ({ isOpen, onClose }) => {
    const { addHabit } = useHabits();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(COLORS[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        addHabit(name, description, { type: 'daily', days: [] }, color);
        setName('');
        setDescription('');
        setColor(COLORS[0]);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(8px)'
                        }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="glass-panel"
                        style={{
                            width: '100%',
                            maxWidth: '450px',
                            margin: 'var(--spacing-md)',
                            position: 'relative',
                            zIndex: 10,
                            padding: 'var(--spacing-xl)',
                            background: 'var(--color-surface)', // Solid background for better readability
                            boxShadow: '0 20px 50px -12px rgba(0,0,0,0.25)'
                        }}
                    >
                        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <h2 className="text-xl font-bold">Create New Habit</h2>
                            <button
                                onClick={onClose}
                                className="btn-ghost"
                                style={{ padding: 'var(--spacing-xs)', borderRadius: '50%' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
                            <div className="flex flex-col gap-sm">
                                <label className="text-sm font-bold text-muted uppercase tracking-wider">Habit Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Morning Meditation"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                    style={{
                                        fontSize: '1.1rem',
                                        padding: 'var(--spacing-md)',
                                        backgroundColor: 'var(--color-bg)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        transition: 'all 0.2s'
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-sm">
                                <label className="text-sm font-bold text-muted uppercase tracking-wider">Description</label>
                                <textarea
                                    placeholder="Add a motivating note..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    style={{
                                        resize: 'none',
                                        padding: 'var(--spacing-md)',
                                        backgroundColor: 'var(--color-bg)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-sm">
                                <label className="text-sm font-bold text-muted uppercase tracking-wider">Color Theme</label>
                                <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
                                    {COLORS.map((c) => (
                                        <motion.button
                                            key={c}
                                            type="button"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setColor(c)}
                                            style={{
                                                width: '2.5rem',
                                                height: '2.5rem',
                                                borderRadius: '50%',
                                                backgroundColor: c,
                                                border: 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: color === c ? `0 0 0 4px var(--color-surface), 0 0 0 6px ${c}` : 'none',
                                                transition: 'box-shadow 0.2s'
                                            }}
                                            aria-label={`Select color ${c}`}
                                        >
                                            {color === c && <Check size={16} color="white" strokeWidth={3} />}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-md" style={{ marginTop: 'var(--spacing-md)' }}>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn btn-ghost"
                                    style={{ fontSize: '1rem' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!name.trim()}
                                    style={{
                                        width: '100%',
                                        maxWidth: '150px',
                                        padding: 'var(--spacing-md)',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Create Habit
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddHabitModal;
