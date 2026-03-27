import { create } from 'zustand';
import {
    applyNodeChanges,
    applyEdgeChanges,
} from '@xyflow/react';
import type {
    Node,
    Edge,
    NodeChange,
    EdgeChange,
} from '@xyflow/react';
import { apiClient } from '../services/ApiClient';

interface FlowState {
    nodes: Node[];
    edges: Edge[];
    prompt: string;
    response: string;
    isLoading: boolean;
    isSaving: boolean;
    isStreaming: boolean;
    error: string | null;
    saveSuccess: boolean;

    conversations: Array<{
        id: string;
        prompt: string;
        response: string;
        model: string;
        createdAt: string;
        updatedAt: string;
    }>;
    isConversationsLoading: boolean;
    isConversationsOpen: boolean;

    setPrompt: (prompt: string) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    runFlow: () => Promise<void>;
    saveConversation: () => Promise<void>;
    appendStreamChunk: (chunk: string) => void;
    setStreamingComplete: () => void;
    setStreamingStart: () => void;
    clearError: () => void;
    
    fetchConversations: () => Promise<void>;
    toggleConversationsOpen: () => void;
}

const initialNodes: Node[] = [
    {
        id: 'input-node',
        type: 'inputNode',
        position: { x: 50, y: 150 },
        data: {},
    },
    {
        id: 'result-node',
        type: 'resultNode',
        position: { x: 550, y: 150 },
        data: {},
    },
];

const initialEdges: Edge[] = [
    {
        id: 'edge-input-result',
        source: 'input-node',
        target: 'result-node',
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 },
    },
];

export const useFlowStore = create<FlowState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    prompt: '',
    response: '',
    isLoading: false,
    isSaving: false,
    isStreaming: false,
    error: null,
    saveSuccess: false,
    
    conversations: [],
    isConversationsLoading: false,
    isConversationsOpen: false,

    setPrompt: (prompt: string) => set({ prompt }),

    onNodesChange: (changes: NodeChange[]) =>
        set({ nodes: applyNodeChanges(changes, get().nodes) }),

    onEdgesChange: (changes: EdgeChange[]) =>
        set({ edges: applyEdgeChanges(changes, get().edges) }),

    runFlow: async () => {
        const { prompt } = get();
        if (!prompt.trim()) {
            set({ error: 'Please enter a prompt before running the flow' });
            return;
        }

        set({ isLoading: true, error: null, response: '', saveSuccess: false });

        try {
            const result = await apiClient.askAi(prompt);
            set({ response: result.data.response, isLoading: false });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to get AI response';
            set({ error: message, isLoading: false });
        }
    },

    saveConversation: async () => {
        const { prompt, response } = get();
        if (!prompt.trim() || !response.trim()) {
            set({ error: 'Both prompt and response are required to save' });
            return;
        }

        set({ isSaving: true, error: null, saveSuccess: false });

        try {
            await apiClient.save(prompt, response);
            set({ isSaving: false, saveSuccess: true });

            setTimeout(() => set({ saveSuccess: false }), 3000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save conversation';
            set({ error: message, isSaving: false });
        }
    },

    appendStreamChunk: (chunk: string) =>
        set((state) => ({ response: state.response + chunk })),

    setStreamingComplete: () => set({ isStreaming: false }),

    setStreamingStart: () => set({ isStreaming: true, response: '', error: null, saveSuccess: false }),

    clearError: () => set({ error: null }),

    fetchConversations: async () => {
        set({ isConversationsLoading: true, error: null });
        try {
            const result = await apiClient.getConversations();
            set({ conversations: result.data, isConversationsLoading: false });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to fetch conversations';
            set({ error: message, isConversationsLoading: false });
        }
    },

    toggleConversationsOpen: () => {
        const state = get();
        const willOpen = !state.isConversationsOpen;
        if (willOpen && state.conversations.length === 0) {
            get().fetchConversations();
        }
        set({ isConversationsOpen: willOpen });
    },
}));
