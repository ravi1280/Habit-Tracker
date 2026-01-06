import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="container">
            <header className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 className="text-xl" style={{ color: 'var(--color-primary)' }}>Habit Tracker</h1>
                {/* Placeholder for future user profile or settings */}
                <div className="icon" style={{ backgroundColor: 'var(--color-border)', borderRadius: '50%' }}></div>
            </header>
            <main className="flex flex-col gap-md">
                {children}
            </main>
        </div>
    );
};

export default Layout;
