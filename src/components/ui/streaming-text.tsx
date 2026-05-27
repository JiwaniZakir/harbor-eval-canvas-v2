'use client';

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';

interface StreamingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function StreamingText({ text, speed = 12, onComplete }: StreamingTextProps) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    lastRef.current = 0;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayed(text);
      onComplete?.();
      return;
    }

    function tick(now: number) {
      if (now - lastRef.current >= speed) {
        lastRef.current = now;
        indexRef.current++;
        setDisplayed(text.slice(0, indexRef.current));
        if (indexRef.current >= text.length) {
          onComplete?.();
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, speed, onComplete]);

  const isComplete = displayed.length >= text.length;

  return (
    <span>
      {displayed}
      {!isComplete && <span className="streaming-cursor" />}
    </span>
  );
}

// Lightweight markdown renderer (zero deps)

function simpleMarkdown(text: string): string {
  let html = text
    // Code blocks (``` ... ```)
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="md-code-block">$2</pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p>');

  // Wrap loose li in ul
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');

  return `<p>${html}</p>`;
}

interface StreamingMarkdownProps {
  content: string;
  isStreaming?: boolean;
}

export function StreamingMarkdown({ content, isStreaming = false }: StreamingMarkdownProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStreaming && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [content, isStreaming]);

  return (
    <div ref={scrollRef} className="agent-prose">
      <div dangerouslySetInnerHTML={{ __html: simpleMarkdown(content) }} />
      {isStreaming && <span className="streaming-cursor" />}
    </div>
  );
}
