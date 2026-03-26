import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useFlowStore } from '../stores/useFlowStore';

export function useAiStream() {
    const socketRef = useRef<Socket | null>(null);
    const appendStreamChunk = useFlowStore((s) => s.appendStreamChunk);
    const setStreamingComplete = useFlowStore((s) => s.setStreamingComplete);
    const setStreamingStart = useFlowStore((s) => s.setStreamingStart);

    useEffect(() => {
        // If VITE_API_URL is provided, connect to it directly (both in local dev and prod).
        // Otherwise fallback to local backend.
        const url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Remove trailing slash if any, to ensure clean paths
        const cleanUrl = url.replace(/\/$/, '');

        // Provide explicit path to Socket.IO and allow cross-origin
        const socket = io(cleanUrl, { 
            transports: ['websocket', 'polling'],
            withCredentials: true // match the backend's cors settings
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('🚀 [SOCKET] Connected');
        });

        socket.on('ai:stream:chunk', (data: { chunk: string }) => {
            appendStreamChunk(data.chunk);
        });

        socket.on('ai:stream:end', () => {
            setStreamingComplete();
        });

        socket.on('ai:stream:error', (data: { error: string }) => {
            useFlowStore.getState().clearError();
            useFlowStore.setState({ error: data.error, isStreaming: false });
        });

        socket.on('disconnect', () => {
            console.log('🚀 [SOCKET] Disconnected');
        });

        return () => {
            socket.disconnect();
        };
    }, [appendStreamChunk, setStreamingComplete, setStreamingStart]);

    const streamPrompt = useCallback((prompt: string) => {
        if (!socketRef.current) return;
        setStreamingStart();
        socketRef.current.emit('ai:prompt:stream', { prompt });
    }, [setStreamingStart]);

    return { streamPrompt };
}
