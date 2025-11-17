import React, { useEffect, useRef, useState, useCallback } from 'react';

// Make pdfjsLib available from the global scope (window)
declare const pdfjsLib: any;

const Icon = ({ name, className = 'w-5 h-5' }: { name: string, className?: string }) => (
    <i className={`ph ph-${name} ${className}`}></i>
);

const PagePlaceholder: React.FC<{
    width: number;
    height: number;
    pageNumber: number;
    onVisible: (pageNumber: number, container: HTMLDivElement) => void;
}> = React.memo(({ width, height, pageNumber, onVisible }) => {
    const placeholderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if(placeholderRef.current) {
                        onVisible(pageNumber, placeholderRef.current);
                        observer.disconnect();
                    }
                }
            },
            { rootMargin: '200px' } // Start loading 200px before it's visible
        );

        if (placeholderRef.current) {
            observer.observe(placeholderRef.current);
        }

        return () => observer.disconnect();
    }, [pageNumber, onVisible]);

    return (
        <div
            ref={placeholderRef}
            style={{ width: `${width}px`, height: `${height}px` }}
            className="mb-6 bg-white rounded-sm flex items-center justify-center shadow-md mx-auto"
        >
            <Icon name="spinner" className="w-8 h-8 animate-spin text-gray-400" />
        </div>
    );
});


const PdfViewer: React.FC<{ 
    base64Content: string;
    zoom?: number;
    pageView?: 'single' | 'double';
}> = ({ base64Content, zoom = 1.5, pageView = 'single' }) => {
    const [pdf, setPdf] = useState<any>(null);
    const [pageDimensions, setPageDimensions] = useState<{width: number, height: number}[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // FIX: Initialize useRef with null to satisfy environments that may require an initial value.
    const pdfRef = useRef<any>(null);
    pdfRef.current = pdf;

    useEffect(() => {
        const loadPdf = async () => {
            if (!base64Content) {
                setError('No PDF content provided.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

                const pdfData = atob(base64Content);
                const uint8Array = new Uint8Array(pdfData.length);
                for (let i = 0; i < pdfData.length; i++) {
                    uint8Array[i] = pdfData.charCodeAt(i);
                }

                const pdfDocument = await pdfjsLib.getDocument({ data: uint8Array }).promise;
                setPdf(pdfDocument);

                const dims = [];
                for (let i = 1; i <= pdfDocument.numPages; i++) {
                    const page = await pdfDocument.getPage(i);
                    const viewport = page.getViewport({ scale: zoom });
                    dims.push({ width: viewport.width, height: viewport.height });
                }
                setPageDimensions(dims);
                setLoading(false);

            } catch (err) {
                console.error('Failed to load PDF:', err);
                setError('Failed to load PDF file. It may be corrupted or an invalid format.');
                setLoading(false);
            }
        };
        loadPdf();
    }, [base64Content, zoom]);

    const renderPage = useCallback(async (pageNumber: number, container: HTMLDivElement) => {
        if (!pdfRef.current) return;
        
        try {
            const page = await pdfRef.current.getPage(pageNumber);
            const viewport = page.getViewport({ scale: zoom });
            
            const canvas = document.createElement('canvas');
            canvas.className = 'shadow-md rounded-sm mx-auto block';
            const context = canvas.getContext('2d');
            if(!context) return;

            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            container.innerHTML = ''; // Clear spinner
            container.appendChild(canvas);
            container.style.height = 'auto'; // Let canvas define height now
            container.style.backgroundColor = 'transparent';
            container.classList.add('mb-6');

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            await page.render(renderContext).promise;
        } catch(e) {
            console.error(`Failed to render page ${pageNumber}`, e);
            container.innerText = 'Error rendering page.';
        }
    }, [zoom]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8">
                 <Icon name="spinner" className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                 <p className="font-semibold text-lg">Preparing Document...</p>
                 <p className="text-sm text-gray-500">This may take a moment for large files.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-red-300 bg-red-50 rounded-lg">
                <Icon name="warning-circle" className="w-12 h-12 text-red-500 mb-4" />
                <p className="font-semibold text-lg text-red-700">Error</p>
                <p className="text-sm text-red-600">{error}</p>
            </div>
        );
    }

    if (pageView === 'double') {
        // Double page view - show 2 pages side by side
        const pageGroups = [];
        for (let i = 0; i < pageDimensions.length; i += 2) {
            pageGroups.push(pageDimensions.slice(i, i + 2));
        }
        
        return (
            <div className="w-full">
                {pageGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="flex justify-center gap-4 mb-6">
                        {group.map((dim, pageIndexInGroup) => {
                            const actualPageIndex = groupIndex * 2 + pageIndexInGroup;
                            return (
                                <PagePlaceholder
                                    key={actualPageIndex}
                                    width={dim.width}
                                    height={dim.height}
                                    pageNumber={actualPageIndex + 1}
                                    onVisible={renderPage}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    }

    // Single page view
    return (
        <div className="w-full">
            {pageDimensions.map((dim, index) => (
                <PagePlaceholder
                    key={index}
                    width={dim.width}
                    height={dim.height}
                    pageNumber={index + 1}
                    onVisible={renderPage}
                />
            ))}
        </div>
    );
};

export default PdfViewer;
