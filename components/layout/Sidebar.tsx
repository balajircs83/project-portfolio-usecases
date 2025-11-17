import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { View, WorkspaceView } from '../../types';

const Icon = ({ name, className = "w-5 h-5" }: { name: string, className?: string }) => (
    <i className={`ph ph-${name} ${className}`}></i>
);

const NavItem: React.FC<{
    icon: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <li>
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors text-muted-foreground ${
                isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'hover:bg-accent hover:text-foreground'
            }`}
        >
            <Icon name={icon} />
            <span>{label}</span>
        </a>
    </li>
);

const WorkspaceSidebar: React.FC = () => {
    const { 
        categories, 
        searchTerm, 
        setSearchTerm,
        workspaceView, 
        setWorkspaceView,
        activeCategoryId, 
        setActiveCategoryId,
        setView
    } = useAppContext();

    const mainNavItems = [
        { name: 'Dashboard', icon: 'gauge', view: WorkspaceView.Dashboard },
        { name: 'Document Library', icon: 'books', view: WorkspaceView.DocumentLibrary },
    ];

    const handleCategoryClick = (categoryId: number) => {
        setWorkspaceView(WorkspaceView.Category);
        setActiveCategoryId(categoryId);
    };
    
    return (
        <div className="p-4 flex flex-col h-full">
            <div className="flex items-center space-x-2 mb-8">
                <Icon name="atom" className="w-8 h-8 text-primary" />
                <div>
                    <span className="text-lg font-bold">Knowledge WS</span>
                    <div className="text-xs text-muted-foreground">Enterprise Plan</div>
                </div>
            </div>
            <nav className="flex-1">
                <ul className="space-y-1 mb-6">
                    {mainNavItems.map(item => (
                         <NavItem 
                            key={item.name} 
                            icon={item.icon} 
                            label={item.name} 
                            isActive={workspaceView === item.view && !activeCategoryId} 
                            onClick={() => {
                                setWorkspaceView(item.view);
                                setActiveCategoryId(null);
                            }} 
                        />
                    ))}
                </ul>
                <div className="relative mb-4">
                    <Icon name="magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Categories</h3>
                    <ul className="space-y-1">
                        {categories.map(cat => (
                            <li key={cat.id}>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleCategoryClick(cat.id);
                                    }}
                                    className={`flex items-center space-x-3 p-2 rounded-lg text-sm transition-colors ${
                                        activeCategoryId === cat.id
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                    }`}
                                >
                                    <span>{cat.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
            <div className="mt-auto pt-4 border-t border-border">
                <button 
                    onClick={() => setView(View.Admin)}
                    className="w-full flex items-center space-x-3 p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                    <Icon name="gear" />
                    <span>Admin Panel</span>
                </button>
            </div>
        </div>
    );
};

const AdminSidebar: React.FC = () => {
    const { setView, setAdminView, adminView } = useAppContext();
    
    const navItems = [
        { name: 'Dashboard', icon: 'gauge' },
        { name: 'Documents', icon: 'files' },
        { name: 'Taxonomy', icon: 'tag' },
        { name: 'Users', icon: 'users' },
        { name: 'Settings', icon: 'gear' },
    ];

    return (
         <div className="p-4 flex flex-col h-full bg-card border-r border-border">
             <div className="flex items-center space-x-2 mb-8">
                <Icon name="shield-check" className="w-8 h-8 text-primary" />
                <div>
                    <span className="text-lg font-bold">Admin User</span>
                    <div className="text-xs text-muted-foreground">Administrator</div>
                </div>
            </div>
            <nav className="flex-1">
                 <ul className="space-y-1">
                    {navItems.map(item => (
                        <li key={item.name}>
                             <a 
                                href="#" 
                                onClick={(e) => { 
                                    e.preventDefault(); 
                                    setAdminView(item.name as any);
                                }} 
                                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                                    item.name === adminView 
                                        ? 'bg-primary/10 text-primary font-semibold' 
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                }`}
                            >
                                <Icon name={item.icon} />
                                <span>{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto pt-4 border-t border-border">
                 <a 
                    href="#" 
                    onClick={(e) => { 
                        e.preventDefault(); 
                        setView(View.Workspace); 
                    }} 
                    className="flex items-center space-x-3 p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                    <Icon name="arrow-left" />
                    <span>Back to Workspace</span>
                 </a>
            </div>
         </div>
    );
};


const Sidebar: React.FC = () => {
    const { view } = useAppContext();
    
    const isWorkspace = view === View.Workspace;

    return (
        <nav className="w-72 flex-shrink-0 bg-card border-r border-border">
           {isWorkspace ? <WorkspaceSidebar /> : <AdminSidebar />}
        </nav>
    );
};

export default Sidebar;