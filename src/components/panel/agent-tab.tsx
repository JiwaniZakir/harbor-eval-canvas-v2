'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowUp, Paperclip, Check, AlertTriangle, Bot, User } from 'lucide-react';
import { useAgentStore } from '@/lib/stores/agent-store';
import { useProjectStore } from '@/lib/stores/project-store';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { StreamingMarkdown } from '@/components/ui/streaming-text';
import { uid, formatRelativeTime } from '@/lib/utils';
import { sendChatMessage } from '@/lib/eval-pipeline';

export function AgentTab() {
  const messages = useAgentStore((s) => s.messages);
  const isStreaming = useAgentStore((s) => s.isStreaming);
  const currentToolCalls = useAgentStore((s) => s.currentToolCalls);
  const addMessage = useAgentStore((s) => s.addMessage);
  const updateMessage = useAgentStore((s) => s.updateMessage);
  const setStreaming = useAgentStore((s) => s.setStreaming);
  const project = useProjectStore((s) => s.project);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    // Add user message
    addMessage({
      id: uid(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    });

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Create placeholder assistant message
    const assistantMsgId = uid();
    addMessage({
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    });

    setStreaming(true);

    await sendChatMessage(
      text,
      (fullText) => {
        // Update the assistant message with streamed content
        updateMessage(assistantMsgId, fullText);
      },
      (finalText) => {
        updateMessage(assistantMsgId, finalText);
        setStreaming(false);
      },
      (error) => {
        updateMessage(assistantMsgId, `Error: ${error}. Please try again.`);
        setStreaming(false);
      }
    );
  }, [input, isStreaming, addMessage, updateMessage, setStreaming]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAutoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto' }}>
        <div className="chat-messages">
          {messages.length === 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 12,
              padding: 40,
              textAlign: 'center',
            }}>
              <Bot size={24} style={{ color: 'var(--fg-20)' }} />
              <p style={{ fontFamily: 'var(--font-figtree)', fontSize: 13, color: 'var(--fg-40)', maxWidth: 260 }}>
                {project
                  ? `Ask me anything about evaluating ${project.targetModel.modelName}, or click a domain node to start probing.`
                  : 'Create a project to start chatting with the evaluation agent.'}
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="chat-message" data-role={msg.role}>
              {(msg.role === 'assistant' || msg.role === 'system') && (
                <div className="chat-message-avatar">
                  <Bot size={14} />
                </div>
              )}
              <div>
                <div className="chat-message-bubble">
                  {msg.role === 'assistant' || msg.role === 'system' ? (
                    <StreamingMarkdown content={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
                <div className="chat-message-time">
                  {formatRelativeTime(new Date(msg.timestamp))}
                </div>

                {/* Tool calls */}
                {msg.toolCalls?.map((tc) => (
                  <div
                    key={tc.id}
                    className="tool-indicator"
                    data-status={tc.status === 'succeeded' ? 'complete' : tc.status === 'failed' ? 'failed' : undefined}
                  >
                    {tc.status === 'running' || tc.status === 'queued' ? (
                      <Spinner size="sm" />
                    ) : tc.status === 'succeeded' ? (
                      <Check size={12} />
                    ) : (
                      <AlertTriangle size={12} />
                    )}
                    <span>
                      {tc.status === 'running' ? 'Running' : tc.status === 'succeeded' ? 'Completed' : 'Failed'}
                      : {tc.summary || tc.name}
                    </span>
                  </div>
                ))}
              </div>
              {msg.role === 'user' && (
                <div className="chat-message-avatar">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}

          {/* Current tool calls */}
          {currentToolCalls.map((tc) => (
            <div key={tc.id} className="tool-indicator">
              <Spinner size="sm" />
              <span>Running: {tc.name}</span>
            </div>
          ))}

          {/* Typing indicator */}
          {isStreaming && messages[messages.length - 1]?.content === '' && (
            <div className="chat-message" data-role="assistant">
              <div className="chat-message-avatar">
                <Bot size={14} />
              </div>
              <div className="typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="chat-composer">
        <Button variant="ghost" size="sm" icon aria-label="Attach file">
          <Paperclip size={16} />
        </Button>
        <textarea
          ref={textareaRef}
          className="chat-composer-input"
          placeholder="Message the agent..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleAutoResize();
          }}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <Button
          variant="primary"
          size="sm"
          icon
          disabled={!input.trim() || isStreaming}
          onClick={handleSend}
          aria-label="Send message"
        >
          <ArrowUp size={16} />
        </Button>
      </div>
    </div>
  );
}
