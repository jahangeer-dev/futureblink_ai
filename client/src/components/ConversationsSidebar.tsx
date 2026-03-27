import { useFlowStore } from '../stores/useFlowStore';

export function ConversationsSidebar() {
    const isOpen = useFlowStore((s) => s.isConversationsOpen);
    const isLoading = useFlowStore((s) => s.isConversationsLoading);
    const conversations = useFlowStore((s) => s.conversations);
    const toggleOpen = useFlowStore((s) => s.toggleConversationsOpen);
    const setPrompt = useFlowStore((s) => s.setPrompt);
    const fetchConversations = useFlowStore((s) => s.fetchConversations);

    if (!isOpen) return null;

    return (
        <div className="fixed top-[81px] bottom-0 right-0 w-[400px] bg-[#0f0f1a]/95 backdrop-blur-xl border-l border-[#2a2a40] z-40 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-transform transform translate-x-0">
            <div className="flex items-center justify-between p-5 border-b border-[#2a2a40] bg-[#1a1a2e]/50">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-xl">💬</span> History
                </h2>
                <div className="flex gap-4">
                    <button 
                        onClick={fetchConversations}
                        className="text-lg text-[#94a3b8] hover:text-[#7c3aed] transition-colors hover:scale-110 transform"
                        title="Refresh"
                    >
                        🔄
                    </button>
                    <button 
                        onClick={toggleOpen}
                        className="text-lg text-[#94a3b8] hover:text-white transition-colors hover:rotate-90 transform"
                        title="Close"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-[#2a2a40] scrollbar-track-transparent">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <span className="inline-block w-8 h-8 border-2 border-[#7c3aed]/30 border-t-[#7c3aed] rounded-full animate-spin"></span>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-[#94a3b8] gap-3">
                        <span className="text-4xl opacity-50">📭</span>
                        <p className="text-sm">No conversations yet.</p>
                        <p className="text-xs opacity-60">Save a flow to see it here!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 pb-4">
                        {conversations.map((conv) => (
                            <div 
                                key={conv.id} 
                                className="bg-[#161625] border border-[#2a2a40] p-4 rounded-xl cursor-pointer hover:border-[#7c3aed]/70 hover:bg-[#1a1a2e] hover:shadow-[0_4px_20px_rgba(124,58,237,0.1)] transition-all duration-200 group"
                                onClick={() => setPrompt(conv.prompt)}
                            >
                                <div className="flex justify-between items-center mb-3 border-b border-[#2a2a40]/50 pb-2">
                                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#7c3aed] bg-[#7c3aed]/10 px-2 py-1 rounded-md">
                                        Saved Flow
                                    </span>
                                    <div className="text-[11px] text-[#64748b] font-medium flex items-center gap-1">
                                        🕒 {new Date(conv.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div className="mb-3 group-hover:translate-x-1 transition-transform duration-200">
                                    <h4 className="text-xs font-bold text-[#a78bfa] mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                                        <span>User</span>
                                    </h4>
                                    <p className="text-sm text-[#f1f5f9] leading-relaxed font-medium">
                                        {conv.prompt}
                                    </p>
                                </div>
                                <div className="bg-[#0f0f1a]/50 p-3 rounded-lg border border-[#2a2a40]/50 group-hover:border-[#2a2a40] transition-colors">
                                    <h4 className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                                        <span>AI</span>
                                    </h4>
                                    <p className="text-[13px] text-[#94a3b8] leading-relaxed line-clamp-4">
                                        {conv.response}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
