import { useFlowStore } from '../stores/useFlowStore';
import { useAiStream } from '../hooks/useAiStream';

export function Toolbar() {
    const prompt = useFlowStore((s) => s.prompt);
    const response = useFlowStore((s) => s.response);
    const isLoading = useFlowStore((s) => s.isLoading);
    const isSaving = useFlowStore((s) => s.isSaving);
    const isStreaming = useFlowStore((s) => s.isStreaming);
    const error = useFlowStore((s) => s.error);
    const saveSuccess = useFlowStore((s) => s.saveSuccess);
    const runFlow = useFlowStore((s) => s.runFlow);
    const saveConversation = useFlowStore((s) => s.saveConversation);
    const clearError = useFlowStore((s) => s.clearError);
    const toggleConversationsOpen = useFlowStore((s) => s.toggleConversationsOpen);

    const { streamPrompt } = useAiStream();

    const handleRunFlow = () => {
        if (!prompt.trim()) return;
        runFlow();
    };

    const handleStream = () => {
        if (!prompt.trim()) return;
        streamPrompt(prompt);
    };

    const handleSave = () => {
        if (!prompt.trim() || !response.trim()) return;
        saveConversation();
    };

    return (
        <div className="flex items-center justify-between px-10 py-5 bg-[#0f0f1a]/90 backdrop-blur-xl border-b border-[#2a2a40] relative z-10">
            <style>{`
                @keyframes explicit-spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
            {/* Brand */}
            <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <span className="text-xl font-extrabold bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent tracking-tight">
                    AI Flow
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-5">
                <button
                    className="text-sm font-semibold text-[#c4b5fd] bg-transparent border border-[#2a2a40] rounded-xl transition-all duration-200 hover:bg-[#1a1a2e] hover:border-[#3a3a55] hover:-translate-y-0.5"
                    style={{ padding: '12px 20px' }}
                    onClick={toggleConversationsOpen}
                >
                    💬 Convos
                </button>

                <button
                    id="stream-btn"
                    className="text-sm font-semibold text-[#c4b5fd] bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-xl transition-all duration-200 hover:bg-[#7c3aed]/20 hover:border-[#7c3aed]/50 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(124,58,237,0.15)] disabled:opacity-40 disabled:cursor-not-allowed disabled:!translate-y-0"
                    style={{ padding: '12px 28px', minWidth: '130px' }}
                    onClick={handleStream}
                    disabled={isLoading || isStreaming || !prompt.trim()}
                >
                    {isStreaming ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="inline-block w-4 h-4 border-2 border-[#c4b5fd]/30 border-t-[#c4b5fd] rounded-full" style={{ animation: 'explicit-spin 0.6s linear infinite' }}></span>
                            Streaming...
                        </span>
                    ) : (
                        '📡 Stream'
                    )}
                </button>

                <button
                    id="save-btn"
                    className="text-sm font-semibold text-[#94a3b8] bg-transparent border border-[#2a2a40] rounded-xl transition-all duration-200 hover:bg-[#1a1a2e] hover:text-[#f1f5f9] hover:border-[#3a3a55] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:!translate-y-0"
                    style={{ padding: '12px 28px', minWidth: '110px' }}
                    onClick={handleSave}
                    disabled={isSaving || !prompt.trim() || !response.trim()}
                >
                    {isSaving ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'explicit-spin 0.6s linear infinite' }}></span>
                            Saving...
                        </span>
                    ) : (
                        '💾 Save'
                    )}
                </button>

                <button
                    id="run-flow-btn"
                    className="text-sm font-bold text-white bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] rounded-xl transition-all duration-200 hover:from-[#8b5cf6] hover:to-[#7c3aed] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(124,58,237,0.35)] disabled:opacity-40 disabled:cursor-not-allowed disabled:!translate-y-0"
                    style={{ padding: '12px 32px', minWidth: '140px' }}
                    onClick={handleRunFlow}
                    disabled={isLoading || isStreaming || !prompt.trim()}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'explicit-spin 0.6s linear infinite' }}></span>
                            Running...
                        </span>
                    ) : (
                        '▶ Run Flow'
                    )}
                </button>
            </div>

            {/* Error Toast */}
            {error && (
                <div
                    className="fixed top-24 right-8 flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30 shadow-2xl cursor-pointer animate-slide-in z-50"
                    onClick={clearError}
                >
                    <span>❌ {error}</span>
                    <button className="bg-transparent border-none text-inherit text-base opacity-60 hover:opacity-100 p-0 cursor-pointer">✕</button>
                </div>
            )}

            {/* Success Toast */}
            {saveSuccess && (
                <div className="fixed top-24 right-8 flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/30 shadow-2xl animate-slide-in z-50">
                    <span>✅ Saved to MongoDB</span>
                </div>
            )}
        </div>
    );
}
