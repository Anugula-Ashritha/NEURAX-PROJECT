import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  Filter, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Building2, 
  FolderGit2, 
  Calendar, 
  BookOpen, 
  User, 
  Globe, 
  CheckCircle2,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { DigitalIdentityGraph, GraphNode, GraphLink, EntityType, ConfidenceLevel, VerificationStatus } from '../types.ts';

interface NetworkGraphProps {
  graph: DigitalIdentityGraph;
  targetName?: string;
  subjectName?: string;
  photoUrl?: string;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ graph, targetName, subjectName }) => {
  const effectiveName = targetName || subjectName || 'Target Subject';
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Filters
  const [selectedTypes, setSelectedTypes] = useState<EntityType[]>([
    'Person', 'Profile', 'Organization', 'Company', 'Project', 'Event', 'Publication', 'Patent', 'Website', 'Alias'
  ]);
  const [minConfidence, setMinConfidence] = useState<'ALL' | 'HIGH' | 'MEDIUM'>('ALL');

  // Dragging nodes state
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Layout calculations on mount or graph update
  useEffect(() => {
    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;

    const positions: Record<string, { x: number; y: number }> = {};
    const nodes = graph.nodes || [];

    // Center the person
    const centerNode = nodes.find(n => n.isCenter || n.type === 'Person') || nodes[0];
    if (centerNode) {
      positions[centerNode.id] = { x: centerX, y: centerY };
    }

    // Distribute surrounding nodes radially in orbits by type
    const nonCenterNodes = nodes.filter(n => n.id !== centerNode?.id);
    const total = nonCenterNodes.length;
    const radiusStep = total > 12 ? 200 : 160;

    nonCenterNodes.forEach((node, idx) => {
      const angle = (2 * Math.PI * idx) / Math.max(1, total);
      // Small jitter so nodes don't overlap completely
      const jitter = (idx % 3) * 20;
      const r = radiusStep + jitter;
      positions[node.id] = {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle),
      };
    });

    setNodePositions(positions);
    setSelectedNode(centerNode || null);
  }, [graph]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return (graph.nodes || []).filter(node => {
      // Type filter
      if (!selectedTypes.includes(node.type)) return false;
      // Confidence filter
      if (minConfidence === 'HIGH' && node.confidence && node.confidence !== 'HIGH') return false;
      if (minConfidence === 'MEDIUM' && node.confidence === 'LOW') return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesLabel = node.label.toLowerCase().includes(q);
        const matchesDetail = node.detail?.toLowerCase().includes(q);
        const matchesPlatform = node.platform?.toLowerCase().includes(q);
        if (!matchesLabel && !matchesDetail && !matchesPlatform) return false;
      }
      return true;
    });
  }, [graph.nodes, selectedTypes, minConfidence, searchQuery]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  // Filtered links
  const filteredLinks = useMemo(() => {
    return (graph.links || []).filter(link => {
      return filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target);
    });
  }, [graph.links, filteredNodeIds]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    } else if (draggedNodeId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;
      setNodePositions(prev => ({
        ...prev,
        [draggedNodeId]: { x: mouseX, y: mouseY }
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeColor = (type: EntityType) => {
    switch (type) {
      case 'Person':
        return '#3b82f6'; // Blue
      case 'Profile':
        return '#10b981'; // Emerald
      case 'Organization':
      case 'Company':
        return '#8b5cf6'; // Violet
      case 'Project':
        return '#f59e0b'; // Amber
      case 'Event':
        return '#ec4899'; // Pink
      case 'Publication':
        return '#06b6d4'; // Cyan
      default:
        return '#64748b'; // Slate
    }
  };

  const getNodeIcon = (type: EntityType) => {
    switch (type) {
      case 'Person':
        return User;
      case 'Profile':
        return Globe;
      case 'Organization':
      case 'Company':
        return Building2;
      case 'Project':
        return FolderGit2;
      case 'Event':
        return Calendar;
      case 'Publication':
        return BookOpen;
      default:
        return CheckCircle2;
    }
  };

  const toggleType = (t: EntityType) => {
    setSelectedTypes(prev => 
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  // Connected entities for selected node
  const connectedNodes = useMemo(() => {
    if (!selectedNode) return [];
    const connectedIds = new Set<string>();
    (graph.links || []).forEach(l => {
      if (l.source === selectedNode.id) connectedIds.add(l.target);
      if (l.target === selectedNode.id) connectedIds.add(l.source);
    });
    return (graph.nodes || []).filter(n => connectedIds.has(n.id));
  }, [selectedNode, graph]);

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search identity graph..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Zoom & Pan Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.4, z - 0.2))}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-slate-500 px-2">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Confidence Filter */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] font-mono text-slate-500 px-2">CONFIDENCE:</span>
          {(['ALL', 'HIGH', 'MEDIUM'] as const).map(conf => (
            <button
              key={conf}
              onClick={() => setMinConfidence(conf)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-semibold transition-colors ${
                minConfidence === conf
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {conf}
            </button>
          ))}
        </div>
      </div>

      {/* Entity Type Filter Badges */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[11px] font-mono text-slate-500 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter Types:
        </span>
        {(['Person', 'Profile', 'Organization', 'Project', 'Event', 'Publication'] as EntityType[]).map(t => {
          const isSelected = selectedTypes.includes(t);
          const color = getNodeColor(t);
          return (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-slate-900 text-white border-slate-700' 
                  : 'bg-slate-950/40 text-slate-600 border-slate-900 opacity-60'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span>{t}</span>
            </button>
          );
        })}
      </div>

      {/* Main Graph Stage + Side Panel */}
      <div className="relative flex flex-col lg:flex-row gap-4 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl min-h-[540px]">
        {/* SVG Interactive Canvas */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden min-h-[480px]"
        >
          <svg
            ref={svgRef}
            className="w-full h-full absolute inset-0 select-none"
            viewBox="0 0 800 500"
            preserveAspectRatio="xMidYMid meet"
          >
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Grid Background Pattern */}
              <defs>
                <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.4" />
                </pattern>
              </defs>
              <rect x="-1000" y="-1000" width="3000" height="3000" fill="url(#graph-grid)" />

              {/* Links */}
              {filteredLinks.map((link, idx) => {
                const sourcePos = nodePositions[link.source] || { x: 400, y: 250 };
                const targetPos = nodePositions[link.target] || { x: 400, y: 250 };
                const isConnectedToSelected = selectedNode && (selectedNode.id === link.source || selectedNode.id === link.target);

                return (
                  <g key={`link_${idx}`}>
                    <line
                      x1={sourcePos.x}
                      y1={sourcePos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke={isConnectedToSelected ? '#3b82f6' : '#334155'}
                      strokeWidth={isConnectedToSelected ? 2 : 1.2}
                      strokeDasharray={isConnectedToSelected ? undefined : '3,3'}
                      opacity={isConnectedToSelected ? 0.9 : 0.45}
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map(node => {
                const pos = nodePositions[node.id] || { x: 400, y: 250 };
                const isSelected = selectedNode?.id === node.id;
                const isCenter = node.isCenter || node.type === 'Person';
                const nodeColor = getNodeColor(node.type);
                const radius = isCenter ? 26 : 18;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggedNodeId(node.id);
                      setSelectedNode(node);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                    }}
                  >
                    {/* Pulsing ring for center or selected */}
                    {(isCenter || isSelected) && (
                      <circle
                        r={radius + 8}
                        fill="none"
                        stroke={nodeColor}
                        strokeWidth="1.5"
                        opacity="0.4"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer border circle */}
                    <circle
                      r={radius + 3}
                      fill="#090d16"
                      stroke={isSelected ? '#ffffff' : nodeColor}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="transition-all"
                    />

                    {/* Inner core circle */}
                    <circle
                      r={radius}
                      fill={nodeColor}
                      opacity={isCenter ? 1 : 0.85}
                    />

                    {/* Node Type Initial */}
                    <text
                      textAnchor="middle"
                      dy=".35em"
                      fill="#ffffff"
                      fontSize={isCenter ? '12' : '10'}
                      fontWeight="bold"
                      fontFamily="monospace"
                      pointerEvents="none"
                    >
                      {node.type.slice(0, 1)}
                    </text>

                    {/* Node Label Below */}
                    <text
                      textAnchor="middle"
                      y={radius + 14}
                      fill={isSelected ? '#ffffff' : '#94a3b8'}
                      fontSize="10"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fontFamily="sans-serif"
                      pointerEvents="none"
                      className="select-none"
                    >
                      {node.label.length > 20 ? `${node.label.slice(0, 18)}...` : node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Hint Overlay */}
          <div className="absolute bottom-3 left-3 pointer-events-none bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] font-mono text-slate-400">
            Click to inspect • Drag to position • Scroll/Pan to explore
          </div>
        </div>

        {/* Node Side Panel (Section 16 requirement) */}
        {selectedNode && (
          <div className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between shrink-0 shadow-lg">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span 
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: getNodeColor(selectedNode.type) }}
                  >
                    {selectedNode.type}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                    {selectedNode.label}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Node Details */}
              <div className="space-y-3 text-xs">
                {selectedNode.detail && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-0.5">DETAIL / CONTEXT</span>
                    {selectedNode.detail}
                  </div>
                )}

                {selectedNode.evidence && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-0.5">SUPPORTING EVIDENCE</span>
                    {selectedNode.evidence}
                  </div>
                )}

                {/* Verification & Confidence */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  {selectedNode.verification && (
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">VERIFICATION</span>
                      <span className="text-emerald-400 font-semibold">{selectedNode.verification}</span>
                    </div>
                  )}
                  {selectedNode.confidence && (
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">CONFIDENCE</span>
                      <span className="text-blue-400 font-semibold">{selectedNode.confidence}</span>
                    </div>
                  )}
                </div>

                {/* Connected Entities */}
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5">
                    CONNECTED ENTITIES ({connectedNodes.length})
                  </span>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {connectedNodes.map(c => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedNode(c)}
                        className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getNodeColor(c.type) }} />
                          <span className="truncate text-xs">{c.label}</span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Open Source Button */}
            {selectedNode.url && (
              <div className="pt-4 mt-4 border-t border-slate-800">
                <a
                  href={selectedNode.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <span>OPEN SOURCE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
