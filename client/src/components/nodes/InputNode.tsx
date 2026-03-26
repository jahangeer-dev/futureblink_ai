import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useFlowStore } from '../../stores/useFlowStore';

function InputNodeComponent() {
    const prompt = useFlowStore((s) => s.prompt);
    const setPrompt = useFlowStore((s) => s.setPrompt);
    const isLoading = useFlowStore((s) => s.isLoading);
    const isStreaming = useFlowStore((s) => s.isStreaming);

    return (
        <div className="w-[400px] bg-[#1a1a2e]/80 backdrop-blur-lg border border-[#2a2a40] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#7c3aed]/50 hover:shadow-[0_8px_40px_rgba(124,58,237,0.1)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 bg-[#12121e] border-b border-[#2a2a40]" style={{ padding: '20px 24px' }}>
                <span className="text-xl">✏️</span>
                <span className="text-sm font-bold text-[#e2e8f0] tracking-[0.12em] uppercase">Input Node</span>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
                <label className="block text-[10px] font-bold text-[#7c3aed] tracking-[0.2em] uppercase" style={{ marginBottom: '16px' }}>Text Input</label>
                <textarea
                    id="prompt-textarea"
                    className="nodrag w-full bg-[#0a0a14] border border-[#2a2a40] rounded-xl text-[#f1f5f9] text-sm leading-relaxed resize-vertical transition-all duration-200 outline-none placeholder:text-[#4a4a6a] focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.2)] disabled:opacity-50 disabled:cursor-not-allowed node-selectable font-[inherit]"
                    style={{ minHeight: '140px', padding: '16px' }}
                    placeholder="Enter your prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading || isStreaming}
                    rows={5}
                />
            </div>

            <Handle
                type="source"
                position={Position.Right}
                id="output"
                className="!w-3.5 !h-3.5 !bg-[#7c3aed] !border-[3px] !border-[#1a1a2e] !rounded-full hover:!bg-[#a78bfa] hover:!shadow-[0_0_12px_rgba(124,58,237,0.5)]"
            />
        </div>
    );
}

export const InputNode = memo(InputNodeComponent);
