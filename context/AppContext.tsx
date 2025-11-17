import { createContext, useContext } from 'react';
import { View, Document, Category, WorkspaceView } from '../types';
import { deleteDocument as apiDeleteDocument, updateDocument as apiUpdateDocument, getDocuments as apiGetDocuments, getCategories as apiGetCategories } from '../services/api';

export type AdminView = 'Dashboard' | 'Documents' | 'Taxonomy' | 'Users' | 'Settings';

interface AppContextType {
    view: View;
    setView: (view: View) => void;
    workspaceView: WorkspaceView;
    setWorkspaceView: (view: WorkspaceView) => void;
    activeCategoryId: number | null;
    setActiveCategoryId: (id: number | null) => void;
    adminView: AdminView;
    setAdminView: (view: AdminView) => void;
    openReader: (docId: number) => void;
    closeReader: () => void;
    documents: Document[];
    categories: Category[];
    isLoading: boolean;
    refreshData: (token: string) => Promise<void>;
    deleteDocument: (id: number, token: string) => Promise<void>;
    updateDocument: (id: number, doc: Omit<Document, 'created_at' | 'owner_id'>, token: string) => Promise<Document>;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategory: string;
    setSelectedCategory: (id: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = AppContext.Provider;

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};