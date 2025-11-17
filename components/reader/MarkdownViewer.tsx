import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const MarkdownViewer: React.FC<{ content: string }> = ({ content }) => {
    // A simple way to check for dark mode for syntax highlighting theme
    const isDarkMode = document.documentElement.classList.contains('dark');
    // FIX: Assigned the theme to a variable to help TypeScript correctly infer the type for the `style` prop.
    const syntaxTheme = isDarkMode ? oneDark : oneLight;

    return (
        <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            components={{
                // FIX: Explicitly typed props as 'any' to resolve the error "Property 'inline' does not exist".
                code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={syntaxTheme}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        />
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
            }}
        />
    );
};

export default MarkdownViewer;