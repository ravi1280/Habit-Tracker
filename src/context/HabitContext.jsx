import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, isToday, parseISO, subHours } from 'date-fns';

const HabitContext = createContext();

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  // Helper to get the date for habit tracking (Day starts at 6 AM)
  // If current time is before 6 AM, it counts as the previous day.
  const getHabitDate = (date = new Date()) => {
    return format(subHours(date, 6), 'yyyy-MM-dd');
  };

  const addHabit = (name, description, frequency = { type: 'daily', days: [] }, color = '#6366f1') => {
    const newHabit = {
      id: uuidv4(),
      name,
      description,
      frequency,
      color,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const updateHabit = (id, updates) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? { ...habit, ...updates } : habit))
    );
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  const toggleHabitCompletion = (id) => {
    const dateString = getHabitDate(); // Use 6 AM logic
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          const isCompleted = habit.completedDates.includes(dateString);
          let newCompletedDates;
          if (isCompleted) {
            newCompletedDates = habit.completedDates.filter((d) => d !== dateString);
          } else {
            newCompletedDates = [...habit.completedDates, dateString];
          }
          return { ...habit, completedDates: newCompletedDates };
        }
        return habit;
      })
    );
  };

  const getHabitStats = (habit) => {
    const totalCompleted = habit.completedDates.length;
    let currentStreak = 0;

    // Use getHabitDate for "today" and "yesterday" logic
    const todayStr = getHabitDate();
    const yesterdayStr = getHabitDate(new Date(Date.now() - 86400000));

    // Check if completed today
    if (habit.completedDates.includes(todayStr)) {
      currentStreak++;
      // Check backwards
      let checkDate = new Date(Date.now() - 86400000);
      while (true) {
        const checkStr = getHabitDate(checkDate);
        if (habit.completedDates.includes(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else if (habit.completedDates.includes(yesterdayStr)) {
      // If not today, but yesterday, streak is still active
      let checkDate = new Date(Date.now() - 86400000);
      while (true) {
        const checkStr = getHabitDate(checkDate);
        if (habit.completedDates.includes(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return {
      totalCompleted,
      currentStreak
    };
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        getHabitStats,
        getHabitDate, // Expose helper
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};
