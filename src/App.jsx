import React, { useState } from 'react';
import { HabitProvider } from './context/HabitContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import HabitList from './components/HabitList';
import AddHabitModal from './components/AddHabitModal';
import ProgressView from './components/ProgressView';
import DashboardHeader from './components/DashboardHeader';
import { Plus, BarChart2, List } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'progress'

  return (
    <ThemeProvider>
      <HabitProvider>
        <Layout headerAction={
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary gap-sm"
            style={{ borderRadius: 'var(--radius-full)', padding: '8px 16px', fontSize: '0.9rem' }}
          >
            <Plus size={18} />
            <span>New Habit</span>
          </button>
        }>
          <DashboardHeader />

          <div className="action-bar" style={{ justifyContent: 'flex-start' }}>
            <div className="glass-panel flex p-1 rounded-lg" style={{ padding: '4px', borderRadius: 'var(--radius-lg)' }}>
              <button
                onClick={() => setView('list')}
                className={`btn ${view === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 'var(--radius-md)', padding: '6px 12px' }}
              >
                <List size={18} style={{ marginRight: '6px' }} />
                List
              </button>
              <button
                onClick={() => setView('progress')}
                className={`btn ${view === 'progress' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 'var(--radius-md)', padding: '6px 12px' }}
              >
                <BarChart2 size={18} style={{ marginRight: '6px' }} />
                Progress
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {view === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <HabitList />
              </motion.div>
            ) : (
              <motion.div
                key="progress"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ProgressView />
              </motion.div>
            )}
          </AnimatePresence>

          <AddHabitModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Layout>
      </HabitProvider>
    </ThemeProvider>
  );
}

export default App;
