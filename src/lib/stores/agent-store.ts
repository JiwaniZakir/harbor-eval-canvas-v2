import { create } from 'zustand';
import type { ChatMessage, ToolCall } from '../types';

interface AgentState {
  messages: ChatMessage[];
  isStreaming: boolean;
  currentToolCalls: ToolCall[];
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, content: string) => void;
  setStreaming: (streaming: boolean) => void;
  addToolCall: (toolCall: ToolCall) => void;
  updateToolCall: (id: string, updates: Partial<ToolCall>) => void;
  clearMessages: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  messages: [],
  isStreaming: false,
  currentToolCalls: [],

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content } : m
      ),
    })),

  setStreaming: (streaming) => set({ isStreaming: streaming }),

  addToolCall: (toolCall) =>
    set((state) => ({
      currentToolCalls: [...state.currentToolCalls, toolCall],
    })),

  updateToolCall: (id, updates) =>
    set((state) => ({
      currentToolCalls: state.currentToolCalls.map((tc) =>
        tc.id === id ? { ...tc, ...updates } : tc
      ),
    })),

  clearMessages: () => set({ messages: [], currentToolCalls: [] }),
}));
