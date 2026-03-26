import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useFlowStore } from '../../stores/useFlowStore';

function ResultNodeComponent() {
    const response = useFlowStore((s) => s.response);
    const isLoading = useFlowStore((s) => s.isLoading);
    const isStreaming = useFlowStore((s) => s.isStreaming);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <style>{`
                        @keyframes explicit-dot {
                            0%, 80%, 100% { transform: scale(0.4); opacity: 0.4; }
                            40% { transform: scale(1); opacity: 1; }
                        }
                    `}</style>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]" style={{ animation: 'explicit-dot 1.4s infinite ease-in-out -0.32s' }}></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]" style={{ animation: 'explicit-dot 1.4s infinite ease-in-out -0.16s' }}></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]" style={{ animation: 'explicit-dot 1.4s infinite ease-in-out' }}></span>
                    </div>
                    <p className="text-xs text-[#64748b] tracking-[0.15em] font-medium">Thinking...</p>
                </div>
            );
        }

        if (isStreaming && response) {
            return (
                <p className="text-sm leading-7 text-[#e2e8f0] whitespace-pre-wrap break-words node-selectable">
                    <style>{`
                        @keyframes explicit-blink {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0; }
                        }
                    `}</style>
                    {response}<span className="text-[#7c3aed] font-bold" style={{ animation: 'explicit-blink 0.7s infinite step-end' }}>▌</span>
                </p>
            );
        }

        if (response) {
            return (
                <p className="text-sm leading-7 text-[#e2e8f0] whitespace-pre-wrap break-words node-selectable">{response}</p>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <span className="text-4xl opacity-30">🤖</span>
                <p className="text-xs text-[#4a4a6a] italic">AI response will appear here</p>
            </div>
        );
    };

    return (
        <div className="w-[440px] bg-[#1a1a2e]/80 backdrop-blur-lg border border-[#2a2a40] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#7c3aed]/50 hover:shadow-[0_8px_40px_rgba(124,58,237,0.1)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 bg-[#12121e] border-b border-[#2a2a40]" style={{ padding: '20px 24px' }}>
                <span className="text-xl">⚡</span>
                <span className="text-sm font-bold text-[#e2e8f0] tracking-[0.12em] uppercase">Result Node</span>
            </div>

            {/* Body — extra padding for breathing room */}
            <div className="overflow-y-auto nodrag nowheel" style={{ padding: '24px', maxHeight: '350px' }}>
                {renderContent()}
            </div>

            <Handle
                type="target"
                position={Position.Left}
                id="input"
                className="!w-3.5 !h-3.5 !bg-[#7c3aed] !border-[3px] !border-[#1a1a2e] !rounded-full hover:!bg-[#a78bfa] hover:!shadow-[0_0_12px_rgba(124,58,237,0.5)]"
            />
        </div>
    );
}

export const ResultNode = memo(ResultNodeComponent);
