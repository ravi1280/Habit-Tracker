import React from 'react';

const Layout = ({ children, headerAction }) => {
    return (
        <div className="container">
            <header className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="flex items-center gap-sm">
                    <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                    <h1 className="text-xl" style={{ color: 'var(--color-primary)' }}>Habit Tracker</h1>
                </div>
                {headerAction}
            </header>
            <main className="flex flex-col gap-md">
                {children}
            </main>
        </div>
    );
};

export default Layout;
