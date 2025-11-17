import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { uploadDocument as apiUploadDocument, updateDocument as apiUpdateDocument, getCategories } from '../../services/api';
import { DocType, Document, Category, Subcategory } from '../../types';

const Icon = ({ name, className = 'w-5 h-5' }: { name: string, className?: string }) => (
    <i className={`ph ph-${name} ${className}`}></i>
);

const UploadModal: React.FC<{ onClose: () => void, docToEdit?: Document }> = ({ onClose, docToEdit }) => {
    const { refreshData } = useAppContext();
    const token = localStorage.getItem('token') || ''; 
    const [localCategories, setLocalCategories] = useState<Category[]>([]);

    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [subcategoryId, setSubcategoryId] = useState<number | ''>('');
    const [summary, setSummary] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const isEditMode = Boolean(docToEdit);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await getCategories(token);
                setLocalCategories(cats);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("Failed to load categories.");
            }
        };
        fetchCategories();
    }, [token]);

    useEffect(() => {
        if (isEditMode && docToEdit) {
            setTitle(docToEdit.title);
            setCategoryId(docToEdit.category_id);
            setSubcategoryId(docToEdit.subcategory_id);
            setSummary(docToEdit.summary || '');
        } else if (localCategories.length > 0) {
            const defaultCategory = localCategories[0];
            setCategoryId(defaultCategory.id);
            setSubcategoryId(defaultCategory.subcategories && defaultCategory.subcategories.length > 0 ? defaultCategory.subcategories[0].id : '');
        }
    }, [docToEdit, isEditMode, localCategories]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
            if (fileType !== 'pdf' && fileType !== 'md') {
                setError('Invalid file type. Please upload a PDF or Markdown file.');
                setFile(null);
            } else {
                setFile(selectedFile);
                setError('');
                if(!title){
                    setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
                }
            }
        }
    };
    
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCatId = Number(e.target.value);
        setCategoryId(newCatId);
        const category = localCategories.find(c => c.id === newCatId);
        setSubcategoryId(category?.subcategories && category.subcategories.length > 0 ? category.subcategories[0].id : '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditMode && !file) {
            setError('Please select a file to upload.');
            return;
        }
        if (!title || !categoryId || !subcategoryId) {
            setError('Please fill all required fields.');
            return;
        }

        setIsUploading(true);
        setError('');

        const handleUpdate = async (content?: string, document_type?: DocType) => {
            if (!docToEdit) return;
            try {
                await apiUpdateDocument(docToEdit.id, {
                    title,
                    category_id: Number(categoryId),
                    subcategory_id: Number(subcategoryId),
                    summary,
                    ...(content && document_type && { content, document_type }),
                }, token);
                await refreshData(token);
                onClose();
            } catch (err: any) {
                console.error("Update failed:", err);
                setError(err.message || 'Failed to update document. Please try again.');
            } finally {
                setIsUploading(false);
            }
        };

        const handleCreate = async (content: string, document_type: DocType) => {
            try {
                await apiUploadDocument({
                    title,
                    document_type,
                    content: document_type === DocType.PDF ? content.split(',')[1] : content,
                    category_id: Number(categoryId),
                    subcategory_id: Number(subcategoryId),
                    summary,
                }, token);
                await refreshData(token);
                onClose();
            } catch (err: any) {
                console.error("Upload failed:", err);
                setError(err.message || 'Failed to upload document. Please try again.');
            } finally {
                setIsUploading(false);
            }
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const content = event.target?.result as string;
                const document_type = file.name.endsWith('.md') ? DocType.Markdown : DocType.PDF;
                if (isEditMode) {
                    const newContent = document_type === DocType.PDF ? content.split(',')[1] : content;
                    await handleUpdate(newContent, document_type);
                } else {
                    await handleCreate(content, document_type);
                }
            };
            reader.onerror = () => {
                setError('Failed to read file.');
                setIsUploading(false);
            };

            if (file.name.endsWith('.md')) {
                reader.readAsText(file);
            } else {
                reader.readAsDataURL(file);
            }
        } else if (isEditMode) {
            await handleUpdate();
        }
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">{isEditMode ? 'Edit Document' : 'Upload New Document'}</h2>
                    <p className="text-sm text-muted-foreground">{isEditMode ? 'Update the details of your document.' : 'Add a new PDF or Markdown file to your knowledge base.'}</p>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6" role="alert">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Side: Document Details */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-lg">Document Details</h3>
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium mb-1.5 text-muted-foreground">Title</label>
                                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium mb-1.5 text-muted-foreground">Category</label>
                                <select id="category" value={categoryId} onChange={handleCategoryChange} className="w-full p-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                                    {localCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="subcategory" className="block text-sm font-medium mb-1.5 text-muted-foreground">Subcategory</label>
                                <select id="subcategory" value={subcategoryId} onChange={e => setSubcategoryId(Number(e.target.value))} className="w-full p-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                                    {localCategories.find(c => c.id === categoryId)?.subcategories?.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="summary" className="block text-sm font-medium mb-1.5 text-muted-foreground">Summary</label>
                                <textarea id="summary" value={summary} onChange={e => setSummary(e.target.value)} rows={3} className="w-full p-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="A brief description of the document's content."></textarea>
                            </div>
                        </div>

                        {/* Right Side: Upload File */}
                        <div>
                            <h3 className="font-medium text-lg mb-4">Upload File</h3>
                            <div className="flex justify-center px-6 py-10 border-2 border-border border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <Icon name="upload-simple" className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <div className="flex text-sm text-muted-foreground">
                                        <label htmlFor="file-input" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                                            <span>Browse files</span>
                                            <input id="file-input" name="file-input" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.md" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">PDF, MD up to 25MB</p>
                                </div>
                            </div>
                            {file && (
                                <div className="mt-6">
                                    <h3 className="font-medium text-lg mb-2">New File Ready for Upload</h3>
                                    <div className="flex items-center p-3 border border-border rounded-lg bg-background">
                                        <Icon name={file.type === 'application/pdf' ? 'file-pdf' : 'file-text'} className="w-8 h-8 mr-3 text-primary" />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                                        </div>
                                        <button type="button" onClick={() => setFile(null)} className="text-muted-foreground hover:text-destructive p-1">
                                            <Icon name="trash-simple" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                             {isEditMode && docToEdit && !file &&(
                                <div className="mt-6">
                                    <h3 className="font-medium text-lg mb-2">Current File</h3>
                                    <div className="flex items-center p-3 border border-border rounded-lg bg-background">
                                        <Icon name={docToEdit.document_type === DocType.PDF ? 'file-pdf' : 'file-text'} className="w-8 h-8 mr-3 text-primary" />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm truncate">{docToEdit.title}</p>
                                            <p className="text-xs text-muted-foreground">Original file cannot be changed.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
                <div className="p-6 border-t border-border flex justify-end space-x-3 mt-auto">
                    <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg border border-border font-semibold hover:bg-accent">Cancel</button>
                    <button type="button" onClick={handleSubmit} disabled={isUploading || (!file && !isEditMode)} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                        {isUploading && <Icon name="spinner" className="animate-spin mr-2" />}
                        {isUploading ? (isEditMode ? 'Updating...' : 'Uploading...') : (isEditMode ? 'Update Document' : 'Upload Document')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;