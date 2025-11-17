
import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory, createSubcategory, updateSubcategory, deleteSubcategory, getDocuments, deleteDocument } from '../services/api';
import { Category, Subcategory, Document } from '../types';
import { useAppContext } from '../context/AppContext';
import UploadModal from '../components/documents/UploadModal';

const Icon = ({ name, className = 'w-5 h-5' }: { name: string, className?: string }) => (
    <i className={`ph ph-${name} ${className}`}></i>
);

const Admin: React.FC = () => {
    const { setView, adminView, openReader } = useAppContext();
    const [categories, setCategories] = useState<Category[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddSubModal, setShowAddSubModal] = useState(false);
    const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<Category | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newSubcategoryName, setNewSubcategoryName] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);
    
    const token = localStorage.getItem('token') || '';

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [cats, docs] = await Promise.all([
                getCategories(token), 
                getDocuments(token)
            ]);
            // console.log('Loaded categories with subcategories:', cats);
            setCategories(cats);
            setDocuments(docs);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, []);

    const getDocumentCount = (categoryId: number) => {
        return documents.filter(d => d.category_id === categoryId).length;
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        
        setIsSaving(true);
        try {
            await createCategory({ name: newCategoryName }, token);
            setNewCategoryName('');
            setShowAddModal(false);
            await fetchData();
        } catch (error) {
            console.error('Failed to create category:', error);
            alert('Failed to create category');
        }
        setIsSaving(false);
    };

    const handleEditCategory = async (category: Category) => {
        const newName = prompt('Enter new category name:', category.name);
        if (!newName || newName.trim() === category.name) return;
        
        setIsSaving(true);
        try {
            await updateCategory(category.id, { id: category.id, name: newName.trim() }, token);
            await fetchData();
        } catch (error) {
            console.error('Failed to update category:', error);
            alert('Failed to update category');
        }
        setIsSaving(false);
    };

    const handleDeleteCategory = async (category: Category) => {
        const docCount = getDocumentCount(category.id);
        if (docCount > 0) {
            alert(`Cannot delete category "${category.name}" because it contains ${docCount} documents.`);
            return;
        }
        
        if (!confirm(`Are you sure you want to delete the category "${category.name}"?`)) return;
        
        setIsSaving(true);
        try {
            await deleteCategory(category.id, token);
            await fetchData();
        } catch (error) {
            console.error('Failed to delete category:', error);
            alert('Failed to delete category');
        }
        setIsSaving(false);
    };

    const handleAddSubcategory = async () => {
        if (!newSubcategoryName.trim() || !selectedCategoryForSub) return;
        
        setIsSaving(true);
        try {
            await createSubcategory({ 
                name: newSubcategoryName.trim(),
                category_id: selectedCategoryForSub.id
            }, token);
            setNewSubcategoryName('');
            setShowAddSubModal(false);
            setSelectedCategoryForSub(null);
            await fetchData();
        } catch (error) {
            console.error('Failed to create subcategory:', error);
            alert('Failed to create subcategory');
        }
        setIsSaving(false);
    };

    const handleEditSubcategory = async (subcategory: Subcategory) => {
        const newName = prompt('Enter new subcategory name:', subcategory.name);
        if (!newName || newName.trim() === subcategory.name) return;
        
        setIsSaving(true);
        try {
            await updateSubcategory(subcategory.id, { 
                id: subcategory.id, 
                name: newName.trim(),
                category_id: subcategory.category_id
            }, token);
            await fetchData();
        } catch (error) {
            console.error('Failed to update subcategory:', error);
            alert('Failed to update subcategory');
        }
        setIsSaving(false);
    };

    const handleDeleteSubcategory = async (subcategory: Subcategory) => {
        if (!confirm(`Are you sure you want to delete the subcategory "${subcategory.name}"?`)) return;
        
        setIsSaving(true);
        try {
            await deleteSubcategory(subcategory.id, token);
            await fetchData();
        } catch (error) {
            console.error('Failed to delete subcategory:', error);
            alert('Failed to delete subcategory');
        }
        setIsSaving(false);
    };

    const handleDeleteDocument = async (doc: Document) => {
        if (!confirm(`Are you sure you want to delete the document "${doc.title}"?`)) return;
        
        setIsSaving(true);
        try {
            await deleteDocument(doc.id, token);
            await fetchData();
        } catch (error) {
            console.error('Failed to delete document:', error);
            alert('Failed to delete document');
        }
        setIsSaving(false);
    };

    const handleUploadSuccess = () => {
        setShowUploadModal(false);
        setEditingDocument(null);
        fetchData();
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Icon name="spinner" className="w-10 h-10 animate-spin text-primary" /></div>;
    }

    const renderContent = () => {
        switch (adminView) {
            case 'Dashboard':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-card border border-border p-6 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Documents</p>
                                        <p className="text-3xl font-bold mt-2">{documents.length}</p>
                                    </div>
                                    <Icon name="files" className="w-12 h-12 text-primary" />
                                </div>
                            </div>
                            <div className="bg-card border border-border p-6 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Categories</p>
                                        <p className="text-3xl font-bold mt-2">{categories.length}</p>
                                    </div>
                                    <Icon name="tag" className="w-12 h-12 text-primary" />
                                </div>
                            </div>
                            <div className="bg-card border border-border p-6 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Subcategories</p>
                                        <p className="text-3xl font-bold mt-2">
                                            {categories.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0)}
                                        </p>
                                    </div>
                                    <Icon name="folders" className="w-12 h-12 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            
            case 'Documents':
                return (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold">Document Management</h1>
                                <p className="text-muted-foreground">Upload, edit, and manage all documents.</p>
                            </div>
                            <button 
                                onClick={() => {
                                    setEditingDocument(null);
                                    setShowUploadModal(true);
                                }}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
                            >
                                <Icon name="upload" />
                                <span>Upload Document</span>
                            </button>
                        </div>
                        <div className="bg-card border border-border rounded-lg overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-border">
                                    <tr>
                                        <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Title</th>
                                        <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Type</th>
                                        <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Category</th>
                                        <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Created</th>
                                        <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted-foreground">No documents found</td>
                                        </tr>
                                    ) : documents.map(doc => (
                                        <tr key={doc.id} className="border-b border-border hover:bg-accent">
                                            <td className="p-4 font-medium">{doc.title}</td>
                                            <td className="p-4 text-muted-foreground uppercase">{doc.document_type}</td>
                                            <td className="p-4 text-muted-foreground">
                                                {categories.find(c => c.id === doc.category_id)?.name || 'N/A'}
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(doc.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <button 
                                                        onClick={() => openReader(doc.id)}
                                                        className="text-muted-foreground hover:text-blue-500" 
                                                        title="View document"
                                                    >
                                                        <Icon name="eye" />
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setEditingDocument(doc);
                                                            setShowUploadModal(true);
                                                        }}
                                                        className="text-muted-foreground hover:text-foreground" 
                                                        title="Edit document"
                                                    >
                                                        <Icon name="pencil-simple" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteDocument(doc)}
                                                        className="text-muted-foreground hover:text-red-500" 
                                                        title="Delete document"
                                                    >
                                                        <Icon name="trash" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            
            case 'Taxonomy':
                return (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold">Taxonomy Management</h1>
                                <p className="text-muted-foreground">Create, edit, and manage document categories and subcategories.</p>
                            </div>
                            <button 
                                onClick={() => setShowAddModal(true)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
                            >
                                <Icon name="plus" />
                                <span>Add New Category</span>
                            </button>
                        </div>
                        
                        <div className="bg-card border border-border rounded-lg">
                            <table className="w-full">
                                <thead className="border-b border-border">
                                    <tr>
                                        <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Name</th>
                                        <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Description</th>
                                        <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Documents</th>
                                        <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center text-muted-foreground">No categories found</td>
                                        </tr>
                                    ) : categories.map(cat => (
                                        <React.Fragment key={cat.id}>
                                            <tr className="border-b border-border hover:bg-accent">
                                                <td className="p-4 font-medium">
                                                    {cat.name} 
                                                    {cat.subcategories && cat.subcategories.length > 0 && (
                                                        <span className="text-xs text-green-500 ml-2">
                                                            ({cat.subcategories.length} subs)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-muted-foreground">Documents related to {cat.name.toLowerCase()}.</td>
                                                <td className="p-4 text-muted-foreground">{getDocumentCount(cat.id)}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-3">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedCategoryForSub(cat);
                                                                setShowAddSubModal(true);
                                                            }}
                                                            className="text-muted-foreground hover:text-green-500" 
                                                            title="Add subcategory"
                                                        >
                                                            <Icon name="plus-circle" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleEditCategory(cat)}
                                                            className="text-muted-foreground hover:text-foreground" 
                                                            title="Edit category"
                                                        >
                                                            <Icon name="pencil-simple" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteCategory(cat)}
                                                            className="text-muted-foreground hover:text-red-500" 
                                                            title="Delete category"
                                                        >
                                                            <Icon name="trash" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {cat.subcategories && cat.subcategories.length > 0 && cat.subcategories.map(subcat => (
                                                <tr key={`sub-${subcat.id}`} className="border-b border-border bg-accent/30">
                                                    <td className="p-4 pl-8">
                                                        <div className="flex items-center">
                                                            <Icon name="corner-down-right" className="w-4 h-4 mr-2 text-muted-foreground" />
                                                            {subcat.name}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-muted-foreground">Subcategory of {cat.name}</td>
                                                    <td className="p-4 text-muted-foreground">-</td>
                                                    <td className="p-4">
                                                        <div className="flex items-center space-x-3">
                                                            <button 
                                                                onClick={() => handleEditSubcategory(subcat)}
                                                                className="text-muted-foreground hover:text-foreground" 
                                                                title="Edit subcategory"
                                                            >
                                                                <Icon name="pencil-simple" className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteSubcategory(subcat)}
                                                                className="text-muted-foreground hover:text-red-500" 
                                                                title="Delete subcategory"
                                                            >
                                                                <Icon name="trash" className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            
            case 'Users':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">User Management</h2>
                        <p className="text-muted-foreground">User management functionality coming soon.</p>
                    </div>
                );
            
            case 'Settings':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Settings</h2>
                        <p className="text-muted-foreground">Settings functionality coming soon.</p>
                    </div>
                );
        }
    };

    return (
        <div className="h-full flex flex-col bg-background text-foreground">
             {renderContent()}
             
             {/* Add Category Modal */}
             {showAddModal && (
                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                     <div className="bg-card border border-border p-6 rounded-lg w-96">
                         <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
                         <input
                             type="text"
                             placeholder="Category name"
                             value={newCategoryName}
                             onChange={(e) => setNewCategoryName(e.target.value)}
                             className="w-full p-3 bg-background border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
                             onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                         />
                         <div className="flex space-x-3">
                             <button
                                 onClick={handleAddCategory}
                                 disabled={isSaving || !newCategoryName.trim()}
                                 className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground py-2 px-4 rounded-lg"
                             >
                                 {isSaving ? 'Creating...' : 'Create Category'}
                             </button>
                             <button
                                 onClick={() => {
                                     setShowAddModal(false);
                                     setNewCategoryName('');
                                 }}
                                 className="flex-1 bg-muted hover:bg-muted/80 py-2 px-4 rounded-lg"
                             >
                                 Cancel
                             </button>
                         </div>
                     </div>
                 </div>
             )}
             
             {/* Add Subcategory Modal */}
             {showAddSubModal && selectedCategoryForSub && (
                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                     <div className="bg-card border border-border p-6 rounded-lg w-96">
                         <h3 className="text-lg font-semibold mb-4">
                             Add Subcategory to "{selectedCategoryForSub.name}"
                         </h3>
                         <input
                             type="text"
                             placeholder="Subcategory name"
                             value={newSubcategoryName}
                             onChange={(e) => setNewSubcategoryName(e.target.value)}
                             className="w-full p-3 bg-background border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
                             onKeyPress={(e) => e.key === 'Enter' && handleAddSubcategory()}
                         />
                         <div className="flex space-x-3">
                             <button
                                 onClick={handleAddSubcategory}
                                 disabled={isSaving || !newSubcategoryName.trim()}
                                 className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-muted text-white py-2 px-4 rounded-lg"
                             >
                                 {isSaving ? 'Creating...' : 'Create Subcategory'}
                             </button>
                             <button
                                 onClick={() => {
                                     setShowAddSubModal(false);
                                     setNewSubcategoryName('');
                                     setSelectedCategoryForSub(null);
                                 }}
                                 className="flex-1 bg-muted hover:bg-muted/80 py-2 px-4 rounded-lg"
                             >
                                 Cancel
                             </button>
                         </div>
                     </div>
                 </div>
             )}

             {/* Upload/Edit Document Modal */}
             {showUploadModal && (
                 <UploadModal 
                     onClose={() => {
                         setShowUploadModal(false);
                         setEditingDocument(null);
                     }}
                     onUploadSuccess={handleUploadSuccess}
                     editingDocument={editingDocument}
                 />
             )}
        </div>
    );
};

export default Admin;
