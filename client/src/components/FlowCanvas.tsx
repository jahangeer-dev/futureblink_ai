import { useMemo } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    BackgroundVariant,
} from '@xyflow/react';
import type { NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFlowStore } from '../stores/useFlowStore';
import { InputNode } from './nodes/InputNode';
import { ResultNode } from './nodes/ResultNode';
import { Toolbar } from './Toolbar';
import { ConversationsSidebar } from './ConversationsSidebar';

export function FlowCanvas() {
    const nodes = useFlowStore((s) => s.nodes);
    const edges = useFlowStore((s) => s.edges);
    const onNodesChange = useFlowStore((s) => s.onNodesChange);
    const onEdgesChange = useFlowStore((s) => s.onEdgesChange);

    const nodeTypes: NodeTypes = useMemo(() => ({
        inputNode: InputNode,
        resultNode: ResultNode,
    }), []);

    return (
        <div className="w-full h-full flex flex-col bg-bg-primary relative">
            <Toolbar />
            <div className="flex-1 w-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.4 }}
                    proOptions={{ hideAttribution: true }}
                    defaultEdgeOptions={{
                        animated: true,
                        style: { stroke: '#7c3aed', strokeWidth: 2 },
                    }}
                >
                    <Background
                        variant={BackgroundVariant.Dots}
                        gap={20}
                        size={1}
                        color="#1e1e36"
                    />
                    <Controls
                        showInteractive={false}
                    />
                </ReactFlow>
            </div>
            
            <ConversationsSidebar />
        </div>
    );
}
