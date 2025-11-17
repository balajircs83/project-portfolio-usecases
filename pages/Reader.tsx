import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getDocumentById } from '../services/api';
import { Document, DocType, ReaderTheme, ReaderMode } from '../types';
import { useAppContext } from '../context/AppContext';
import MarkdownViewer from '../components/reader/MarkdownViewer';
import PdfViewer from '../components/reader/PdfViewer';

const Icon = ({ name, className = 'w-6 h-6' }: { name: string, className?: string }) => (
    <i className={`ph ph-${name} ${className}`}></i>
);

const ReaderControls: React.FC<{
    onClose: () => void;
    fontSize: number;
    setFontSize: (size: number) => void;
    theme: string;
    setTheme: (theme: string) => void;
    zoom: number;
    setZoom: (zoom: number) => void;
    pageView: 'single' | 'double';
    setPageView: (view: 'single' | 'double') => void;
    isPdf: boolean;
}> = ({ onClose, fontSize, setFontSize, theme, setTheme, zoom, setZoom, pageView, setPageView, isPdf }) => {
    const themes = [
        { name: 'sepia', color: '#F4ECD8', label: 'Sepia' },
        { name: 'light', color: '#FFFFFF', label: 'Light' },
        { name: 'silver', color: '#E8E8E8', label: 'Silver' },
        { name: 'dark', color: '#1A1A1A', label: 'Dark' },
    ];

    return (
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/70 to-transparent">
            <button onClick={onClose} className="flex items-center space-x-2 p-2 px-3 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-sm">
                <Icon name="arrow-left" className="w-5 h-5" />
                <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center space-x-4">
                {/* Font Size / Zoom Controls */}
                <div className="flex items-center space-x-2 p-1 px-3 rounded-lg bg-black/40 backdrop-blur-sm">
                    <button 
                        onClick={() => isPdf ? setZoom(Math.max(0.5, zoom - 0.25)) : setFontSize(Math.max(14, fontSize - 2))} 
                        className="p-2 text-white hover:bg-white/20 rounded-md transition-colors"
                        title={isPdf ? "Zoom out" : "Decrease font size"}
                    >
                        <Icon name="minus" className="w-4 h-4" />
                    </button>
                    <span className="text-white font-medium text-sm px-2">
                        {isPdf ? `${Math.round(zoom * 100)}%` : 'Aa'}
                    </span>
                    <button 
                        onClick={() => isPdf ? setZoom(Math.min(3, zoom + 0.25)) : setFontSize(Math.min(28, fontSize + 2))} 
                        className="p-2 text-white hover:bg-white/20 rounded-md transition-colors"
                        title={isPdf ? "Zoom in" : "Increase font size"}
                    >
                        <Icon name="plus" className="w-4 h-4" />
                    </button>
                </div>
                
                {/* Page View Toggle (PDF only) */}
                {isPdf && (
                    <div className="flex items-center space-x-1 p-1 rounded-lg bg-black/40 backdrop-blur-sm">
                        <button
                            onClick={() => setPageView('single')}
                            className={`p-2 text-white rounded-md transition-colors ${pageView === 'single' ? 'bg-white/30' : 'hover:bg-white/10'}`}
                            title="Single page view"
                        >
                            <Icon name="file" className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPageView('double')}
                            className={`p-2 text-white rounded-md transition-colors ${pageView === 'double' ? 'bg-white/30' : 'hover:bg-white/10'}`}
                            title="Double page view"
                        >
                            <Icon name="files" className="w-4 h-4" />
                        </button>
                    </div>
                )}
                
                {/* Theme Controls */}
                <div className="flex items-center space-x-1 p-1 rounded-lg bg-black/40 backdrop-blur-sm">
                    {themes.map((t) => (
                        <button
                            key={t.name}
                            onClick={() => setTheme(t.name)}
                            className={`p-1.5 rounded-md transition-colors ${theme === t.name ? 'bg-white/30' : 'hover:bg-white/10'}`}
                            title={t.label}
                        >
                            <div className="w-6 h-6 rounded-full border-2 border-white/50" style={{ backgroundColor: t.color }}></div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Reader: React.FC<{ docId: string }> = ({ docId }) => {
    const { closeReader } = useAppContext();
    const [document, setDocument] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fontSize, setFontSize] = useState(18);
    const [theme, setTheme] = useState('sepia');
    const [zoom, setZoom] = useState(1.5);
    const [pageView, setPageView] = useState<'single' | 'double'>('single');

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const themeStyles = {
        sepia: { bg: '#F4ECD8', text: '#2C2416' },
        light: { bg: '#FFFFFF', text: '#1F2937' },
        silver: { bg: '#E8E8E8', text: '#1F2937' },
        dark: { bg: '#1A1A1A', text: '#E5E7EB' },
    };

    useEffect(() => {
        const fetchDoc = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token') || '';
            try {
                const doc = await getDocumentById(parseInt(docId), token);
                if (doc) {
                    setDocument(doc);
                } else {
                    closeReader();
                }
            } catch (error) {
                console.error('Failed to fetch document:', error);
                closeReader();
            }
            setIsLoading(false);
        };
        fetchDoc();
    }, [docId, closeReader]);

    const currentTheme = themeStyles[theme as keyof typeof themeStyles];

    if (isLoading || !document) {
        return (
            <div 
                className="w-full h-full flex justify-center items-center" 
                style={{ backgroundColor: currentTheme.bg }}
            >
                <Icon name="spinner" className="w-12 h-12 animate-spin" style={{ color: currentTheme.text }} />
            </div>
        );
    }

    const isPdf = document.type === DocType.Pdf;

    return (
        <div 
            ref={containerRef} 
            className="w-full h-full fixed top-0 left-0 z-50 overflow-hidden"
            style={{ backgroundColor: currentTheme.bg }}
        >
            <ReaderControls
                onClose={closeReader}
                fontSize={fontSize}
                setFontSize={setFontSize}
                theme={theme}
                setTheme={setTheme}
                zoom={zoom}
                setZoom={setZoom}
                pageView={pageView}
                setPageView={setPageView}
                isPdf={isPdf}
            />

            <div 
                ref={contentRef}
                className="reader-content-area w-full h-full overflow-y-auto pt-20 pb-12"
            >
                <div 
                    style={{ fontSize: `${fontSize}px`, color: currentTheme.text }} 
                    className="max-w-5xl mx-auto px-8 leading-relaxed"
                >
                    {document.type === DocType.Markdown ? (
                        <div className="prose prose-lg max-w-none font-serif">
                            <MarkdownViewer content={document.content} />
                        </div>
                    ) : (
                        <PdfViewer 
                            base64Content={document.content} 
                            zoom={zoom}
                            pageView={pageView}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reader;