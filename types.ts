export enum View {
    Workspace = 'WORKSPACE',
    Reader = 'READER',
    Admin = 'ADMIN',
}

export enum WorkspaceView {
    Dashboard = 'DASHBOARD',
    DocumentLibrary = 'DOCUMENT_LIBRARY',
    Category = 'CATEGORY',
}

export enum DocType {
    PDF = 'pdf',
    Markdown = 'md',
}

export interface Subcategory {
    id: number;
    name: string;
    category_id?: number; // Optional as it might be nested
}

export interface Category {
    id: number;
    name: string;
    subcategories?: Subcategory[]; // Optional as it might be nested or not always included
}

export interface Document {
    id: number;
    title: string;
    document_type: DocType;
    content: string; // For MD, content is string. For PDF, it's base64.
    category_id: number;
    subcategory_id: number;
    tags?: string[]; // Optional as it's not in the backend model yet
    summary?: string;
    created_at: string; // Use created_at to match backend
    owner_id: number;
}

export enum ReaderTheme {
    Light = 'light',
    Dark = 'dark',
    Sepia = 'sepia',
    Grey = 'grey'
}

export enum ReaderMode {
    Scroll = 'scroll',
    Paginated = 'paginated'
}

export interface ReadingProgress {
    mode: ReaderMode;
    scrollPosition?: number;
    currentPage?: number;
}