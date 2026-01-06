import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import HabitItem from './HabitItem';

const HabitList = () => {
    const { habits } = useHabits();

    if (habits.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                <p className="text-muted">No habits yet. Start by adding one!</p>
            </div>
        );
    }

    return (
        <div className="grid-habits">
            <AnimatePresence mode="popLayout">
                {habits.map((habit) => (
                    <HabitItem key={habit.id} habit={habit} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default HabitList;
