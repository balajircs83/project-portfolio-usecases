import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Document, WorkspaceView, DocType, Category } from '../types';
import UploadModal from '../components/documents/UploadModal';
import { getDocumentById, deleteDocument as apiDeleteDocument } from '../services/api';

const Icon = ({ name, className = 'w-5 h-5' }: { name: string, className?: string }) => (
    <i className={`ph ph-${name} ${className}`}></i>
);

const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    return Math.floor(seconds) + " seconds ago";
};

const DocumentCard: React.FC<{ doc: Document, onRead: (id: number) => void, onEdit: (doc: Document) => void, onDelete: (id: number) => void, categoryName: string }> = ({ doc, onRead, onEdit, onDelete, categoryName }) => (
    <div className="bg-card border border-border rounded-lg shadow-sm hover:shadow-lg hover:border-primary transition-all duration-300 p-5 flex flex-col justify-between group relative">
        <div onClick={() => onRead(doc.id)} className="cursor-pointer">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary truncate">{doc.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 h-10 overflow-hidden text-ellipsis">
                {doc.summary || 'No summary available.'}
            </p>
        </div>
        <div className="mt-4 flex justify-between items-center">
            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-500`}>
                {categoryName}
            </span>
            <span className="text-xs text-muted-foreground">
                Modified {timeAgo(doc.created_at)}
            </span>
        </div>
        <div className="absolute top-2 right-2 flex items-center space-x-1">
            <button onClick={(e) => { e.stopPropagation(); onEdit(doc); }} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground">
                Edit
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-destructive">
                Delete
            </button>
        </div>
    </div>
);

const UploadCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div 
        onClick={onClick}
        className="border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center p-5 text-center cursor-pointer hover:border-primary hover:text-primary transition-colors text-muted-foreground"
    >
        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-3">
            <Icon name="plus" className="w-6 h-6" />
        </div>
        <h3 className="font-semibold">Upload a new document</h3>
        <p className="text-sm">Drag and drop files here or click to browse.</p>
    </div>
);

const DashboardView: React.FC = () => {
    const { documents, categories, openReader, setWorkspaceView, setActiveCategoryId, deleteDocument, refreshData } = useAppContext();
    const token = localStorage.getItem('token') || '';
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<Document | undefined>(undefined);

    const recentDocs = useMemo(() => documents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4), [documents]);

    const categoryMap = useMemo(() => {
        const map = new Map<number, string>();
        categories.forEach(cat => map.set(cat.id, cat.name));
        return map;
    }, [categories]);

    const handleCategoryClick = (categoryId: number) => {
        setWorkspaceView(WorkspaceView.Category);
        setActiveCategoryId(categoryId);
    };

    const handleEdit = (doc: Document) => {
        setEditingDoc(doc);
        setUploadModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await deleteDocument(id, token);
                await refreshData(token);
            } catch (error) {
                console.error('Failed to delete document:', error);
                // You could show an error toast to the user here
            }
        }
    };

    const closeModal = () => {
        setUploadModalOpen(false);
        setEditingDoc(undefined);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground mb-6">An overview of your knowledge base.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="text-muted-foreground font-semibold flex items-center"><Icon name="files" className="mr-2" />Total Documents</h3>
                    <p className="text-3xl font-bold mt-2">{documents.length}</p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="text-muted-foreground font-semibold flex items-center"><Icon name="tag" className="mr-2" />Total Categories</h3>
                    <p className="text-3xl font-bold mt-2">{categories.length}</p>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Recently Uploaded</h2>
            {recentDocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {recentDocs.map(doc => (
                        <DocumentCard
                            key={doc.id}
                            doc={doc}
                            onRead={openReader}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            categoryName={categoryMap.get(doc.category_id) || 'N/A'}
                        />
                    ))}
                </div>
            ) : <p className="text-muted-foreground mb-8">No recent documents.</p>}
            
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(cat => (
                    <div key={cat.id} onClick={() => handleCategoryClick(cat.id)} className="bg-card p-6 rounded-lg border border-border cursor-pointer hover:border-primary hover:shadow-md transition-all group">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">{documents.filter(d => d.category_id === cat.id).length} documents</p>
                    </div>
                ))}
            </div>
            {isUploadModalOpen && <UploadModal onClose={closeModal} docToEdit={editingDoc} />}
        </div>
    );
};

const DocumentLibraryView: React.FC = () => {
    const { documents, categories, openReader, searchTerm, sortBy, setSortBy, refreshData, deleteDocument } = useAppContext();
    const token = localStorage.getItem('token') || '';
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<Document | undefined>(undefined);

    const categoryMap = useMemo(() => {
        const map = new Map<number, string>();
        categories.forEach(cat => map.set(cat.id, cat.name));
        return map;
    }, [categories]);

    const handleEdit = (doc: Document) => {
        setEditingDoc(doc);
        setUploadModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await deleteDocument(id, token);
                await refreshData(token);
            } catch (error) {
                console.error('Failed to delete document:', error);
                // You could show an error toast to the user here
            }
        }
    };

    const closeModal = () => {
        setUploadModalOpen(false);
        setEditingDoc(undefined);
    };

    const filteredAndSortedDocuments = useMemo(() => {
        return documents
            .filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                if (sortBy === 'recent') {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                } else {
                    return a.title.localeCompare(b.title);
                }
            });
    }, [documents, searchTerm, sortBy]);

    return (
        <div className="h-full flex flex-col">
            <header className="flex-shrink-0 mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Document Library</h1>
                    <p className="text-muted-foreground">Browse all available technical documents.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="p-2 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="recent">Sort by: Recently Added</option>
                        <option value="alphabetical">Sort by: Alphabetical</option>
                    </select>
                    <button
                        onClick={() => setUploadModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
                    >
                        <Icon name="upload-simple" />
                        <span>Upload Document</span>
                    </button>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto pr-2">
                {filteredAndSortedDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <UploadCard onClick={() => setUploadModalOpen(true)} />
                        {filteredAndSortedDocuments.map(doc => (
                            <DocumentCard
                                key={doc.id}
                                doc={doc}
                                onRead={openReader}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                categoryName={categoryMap.get(doc.category_id) || 'N/A'}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <Icon name="file-search" className="w-16 h-16 mb-4" />
                        <h3 className="text-xl font-semibold">No Documents Found</h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
            {isUploadModalOpen && <UploadModal onClose={closeModal} docToEdit={editingDoc} />}
        </div>
    );
};

const CategoryView: React.FC = () => {
    const { documents, categories, activeCategoryId, openReader, deleteDocument, refreshData } = useAppContext();
    const token = localStorage.getItem('token') || '';
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<Document | undefined>(undefined);

    const category = useMemo(() => categories.find(c => c.id === activeCategoryId), [categories, activeCategoryId]);
    const categoryDocs = useMemo(() => documents.filter(d => d.category_id === activeCategoryId), [documents, activeCategoryId]);

    const handleEdit = (doc: Document) => {
        setEditingDoc(doc);
        setUploadModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await deleteDocument(id, token);
                await refreshData(token);
            } catch (error) {
                console.error('Failed to delete document:', error);
            }
        }
    };

    const closeModal = () => {
        setUploadModalOpen(false);
        setEditingDoc(undefined);
    };
    
    if (!category) {
        return <div className="text-center text-muted-foreground">Category not found or specified.</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <header className="flex-shrink-0 mb-6">
                <h1 className="text-2xl font-bold">{category.name}</h1>
                <p className="text-muted-foreground">{categoryDocs.length} documents in this category.</p>
            </header>
            <div className="flex-1 overflow-y-auto pr-2">
                {categoryDocs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categoryDocs.map(doc => (
                            <DocumentCard
                                key={doc.id}
                                doc={doc}
                                onRead={openReader}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                categoryName={category.name}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <Icon name="folder-notch-open" className="w-16 h-16 mb-4" />
                        <h3 className="text-xl font-semibold">No Documents in this Category</h3>
                        <p>Upload a document to get started.</p>
                    </div>
                )}
            </div>
            {isUploadModalOpen && <UploadModal onClose={closeModal} docToEdit={editingDoc} />}
        </div>
    );
};

const Workspace: React.FC = () => {
    const { isLoading, workspaceView, refreshData } = useAppContext();
    const token = localStorage.getItem('token') || '';

    useEffect(() => {
        if (token) {
            refreshData(token);
        }
    }, [token, refreshData]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Icon name="spinner" className="w-10 h-10 animate-spin text-primary"/></div>;
    }

    const renderWorkspaceView = () => {
        switch (workspaceView) {
            case WorkspaceView.DocumentLibrary:
                return <DocumentLibraryView />;
            case WorkspaceView.Category:
                return <CategoryView />;
            case WorkspaceView.Dashboard:
            default:
                return <DashboardView />;
        }
    };

    return <div className="h-full">{renderWorkspaceView()}</div>;
};

export default Workspace;