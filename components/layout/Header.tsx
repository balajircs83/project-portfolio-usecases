import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { View } from '../../types';

const Icon = ({ name, className = 'w-5 h-5' }: { name: string, className?: string }) => (
    <i className={`ph ph-${name} ${className}`}></i>
);

const UserMenu: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const { theme, setTheme } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-9 h-9 rounded-full bg-muted overflow-hidden">
                <img src="https://i.pravatar.cc/40" alt="User Avatar" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-10">
                    <div className="p-2">
                        <div className="px-2 py-1.5 text-sm font-semibold">John Doe</div>
                        <div className="px-2 text-xs text-muted-foreground">john.doe@example.com</div>
                    </div>
                    <div className="h-px bg-border my-1"></div>
                    <button onClick={toggleTheme} className="w-full text-left flex items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent">
                        <span>Theme</span>
                        <Icon name={theme === 'light' ? 'moon' : 'sun'} />
                    </button>
                    <button className="w-full text-left flex items-center space-x-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent">
                        <Icon name="gear" />
                        <span>Settings</span>
                    </button>
                    <div className="h-px bg-border my-1"></div>
                    <button onClick={onLogout} className="w-full text-left flex items-center space-x-2 px-2 py-1.5 text-sm rounded-sm text-red-500 hover:bg-red-500/10">
                         <Icon name="sign-out" />
                        <span>Log Out</span>
                    </button>
                </div>
            )}
        </div>
    );
};

const WorkspaceHeader: React.FC<{onLogout: () => void}> = ({onLogout}) => {
    return (
        <div className="flex-1 flex justify-between items-center">
            <div className="relative w-full max-w-xs">
                <Icon name="magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Global Search..."
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div className="flex items-center space-x-4">
                 <button className="p-2 rounded-full hover:bg-accent text-muted-foreground">
                    <Icon name="bell" />
                 </button>
                 <button className="p-2 rounded-full hover:bg-accent text-muted-foreground">
                    <Icon name="question" />
                 </button>
                 <UserMenu onLogout={onLogout} />
            </div>
        </div>
    );
}

const AdminHeader: React.FC = () => {
    const { adminView } = useAppContext();
    
    const titles = {
        'Dashboard': 'Admin Dashboard',
        'Documents': 'Document Management',
        'Taxonomy': 'Taxonomy Management',
        'Users': 'User Management',
        'Settings': 'Settings'
    };
    
    return (
        <h1 className="text-xl font-bold">
            {titles[adminView]}
        </h1>
    );
}


const Header: React.FC<{onLogout: () => void}> = ({onLogout}) => {
    const { view } = useAppContext();
    
    return (
        <header className="flex-shrink-0 bg-card border-b border-border p-4 flex justify-between items-center">
            {view === View.Admin ? <AdminHeader /> : <WorkspaceHeader onLogout={onLogout} />}
        </header>
    );
};

export default Header;