import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AppProvider, AdminView } from './context/AppContext';
import { View, WorkspaceView } from './types';
import Workspace from './pages/Workspace';
import Admin from './pages/Admin';
import Reader from './pages/Reader';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import { Document, Category } from './types';
import { getDocuments, getCategories, deleteDocument as apiDeleteDocument, updateDocument as apiUpdateDocument } from './services/api';
import LoginPage from './pages/LoginPage';


const App: React.FC = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [view, setView] = useState<View>(View.Workspace);
    const [workspaceView, setWorkspaceView] = useState<WorkspaceView>(WorkspaceView.Dashboard);
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
    const [adminView, setAdminView] = useState<AdminView>('Taxonomy');

    const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark'>(
        localStorage.getItem('theme') as 'light' | 'dark' || 'light'
    );

    // Filter states lifted from Workspace
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('recent');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleLogin = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setDocuments([]);
        setCategories([]);
        setView(View.Workspace); // Reset view on logout
    };


    const refreshData = useCallback(async (authToken: string) => {
        setIsLoading(true);
        try {
            const [docs, cats] = await Promise.all([getDocuments(authToken), getCategories(authToken)]);
            setDocuments(docs);
            setCategories(cats);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            handleLogout(); // Logout if token is invalid or expired
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (token) {
            refreshData(token);
        }
    }, [token, refreshData]);

    const openReader = (docId: number) => {
        setSelectedDocumentId(docId);
        setView(View.Reader);
    };

    const closeReader = () => {
        setSelectedDocumentId(null);
        setView(View.Workspace);
    };
    
    const deleteDocument = useCallback(async (id: number, authToken: string) => {
        try {
            await apiDeleteDocument(id, authToken);
            refreshData(authToken);
        } catch (error) {
            console.error("Failed to delete document:", error);
            throw error;
        }
    }, [refreshData]);

    const updateDocument = useCallback(async (id: number, doc: Omit<Document, 'created_at' | 'owner_id'>, authToken: string) => {
        try {
            const updatedDoc = await apiUpdateDocument(id, doc, authToken);
            refreshData(authToken);
            return updatedDoc;
        } catch (error) {
            console.error("Failed to update document:", error);
            throw error;
        }
    }, [refreshData]);


    const value = useMemo(() => ({
        view,
        setView,
        workspaceView,
        setWorkspaceView,
        activeCategoryId,
        setActiveCategoryId,
        adminView,
        setAdminView,
        openReader,
        closeReader,
        documents,
        categories,
        isLoading,
        refreshData,
        deleteDocument,
        updateDocument,
        theme,
        setTheme,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
    }), [view, workspaceView, activeCategoryId, adminView, documents, categories, isLoading, refreshData, deleteDocument, updateDocument, theme, searchTerm, selectedCategory, sortBy]);

    if (!token) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <AppProvider value={value}>
            <div className="flex h-screen bg-background text-foreground">
                {view !== View.Reader && <Sidebar />}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {view !== View.Reader && <Header onLogout={handleLogout} />}
                    <main className={`flex-1 overflow-x-hidden overflow-y-auto ${view !== View.Reader ? 'p-6' : ''}`}>
                        {view === View.Workspace && <Workspace />}
                        {view === View.Reader && selectedDocumentId && <Reader docId={selectedDocumentId.toString()} />}
                        {view === View.Admin && <Admin />}
                    </main>
                </div>
            </div>
        </AppProvider>
    );
};

export default App;