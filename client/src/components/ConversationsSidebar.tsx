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
        <div className="fixed inset-y-0 right-0 w-96 bg-[#0f0f1a]/95 backdrop-blur-xl border-l border-[#2a2a40] z-50 flex flex-col shadow-2xl transition-transform transform translate-x-0">
            <div className="flex items-center justify-between p-5 border-b border-[#2a2a40]">
                <h2 className="text-lg font-bold text-white">Conversations</h2>
                <div className="flex gap-3">
                    <button 
                        onClick={fetchConversations}
                        className="text-sm text-[#94a3b8] hover:text-white transition-colors"
                        title="Refresh"
                    >
                        🔄
                    </button>
                    <button 
                        onClick={toggleOpen}
                        className="text-sm text-[#94a3b8] hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-[#2a2a40] scrollbar-track-transparent">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <span className="inline-block w-6 h-6 border-2 border-[#7c3aed]/30 border-t-[#7c3aed] rounded-full animate-spin"></span>
                    </div>
                ) : conversations.length === 0 ? (
                    <p className="text-center text-[#94a3b8] py-10 text-sm">No conversations found.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {conversations.map((conv) => (
                            <div 
                                key={conv.id} 
                                className="bg-[#1a1a2e] border border-[#2a2a40] p-4 rounded-xl cursor-pointer hover:border-[#7c3aed] transition-colors"
                                onClick={() => setPrompt(conv.prompt)}
                            >
                                <div className="text-xs text-[#94a3b8] mb-2 font-medium truncate">
                                    {new Date(conv.createdAt).toLocaleString()}
                                </div>
                                <p className="text-sm text-white line-clamp-2 mb-2 font-medium">
                                    <span className="text-[#a78bfa] mr-2">Q:</span>
                                    {conv.prompt}
                                </p>
                                <p className="text-xs text-[#94a3b8] line-clamp-3">
                                    <span className="text-emerald-400 mr-2">A:</span>
                                    {conv.response}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
