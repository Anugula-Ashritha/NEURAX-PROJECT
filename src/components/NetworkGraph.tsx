import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Filter, 
  Maximize2,
  Info,
  User,
  AtSign,
  Globe,
  Building2,
  Code2,
  Trophy,
  Lightbulb,
  Sparkles,
  Layers,
  LayoutGrid,
  Link as LinkIcon
} from 'lucide-react';
import { RelationshipGraph, GraphNode, GraphLink } from '../types';

interface NetworkGraphProps {
  graph: RelationshipGraph;
  subjectName: string;
  photoUrl?: string;
}

interface LayoutNode extends GraphNode {
  x: number;
  y: number;
  radius: number;
  color: string;
  glowColor: string;
  borderColor: string;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ graph, subjectName, photoUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'orbit' | 'cluster' | 'matrix'>('orbit');
  
  // Transform & Pan/Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const width = 960;
  const height = 620;
  const centerX = width / 2;
  const centerY = height / 2;

  // Topological positioning calculation
  const layout = useMemo(() => {
    const rawNodes = graph?.nodes || [];
    const rawLinks = graph?.links || [];

    if (rawNodes.length === 0) {
      return { nodes: [], links: [] };
    }

    // Identify or synthesize central identity node
    let centerNode = rawNodes.find(n => n.type === 'identity' || n.id === 'identity');
    if (!centerNode) {
      centerNode = {
        id: 'identity_root',
        label: subjectName,
        type: 'identity',
      };
    }

    // Group other nodes by type
    const aliases = rawNodes.filter(n => n.id !== centerNode?.id && n.type === 'alias');
    const platforms = rawNodes.filter(n => n.id !== centerNode?.id && n.type === 'platform');
    const orgs = rawNodes.filter(n => n.id !== centerNode?.id && n.type === 'organization');
    const projects = rawNodes.filter(n => n.id !== centerNode?.id && n.type === 'project');
    const events = rawNodes.filter(n => n.id !== centerNode?.id && n.type === 'event');
    const patents = rawNodes.filter(n => n.id !== centerNode?.id && n.type === 'patent');
    const others = rawNodes.filter(n => 
      n.id !== centerNode?.id && 
      !['alias', 'platform', 'organization', 'project', 'event', 'patent'].includes(n.type)
    );

    const layoutNodes: LayoutNode[] = [];

    if (viewMode === 'cluster') {
      // Force / Hub Cluster Layout
      // Center Node (Subject)
      layoutNodes.push({
        ...centerNode,
        x: centerX,
        y: centerY - 20,
        radius: 34,
        color: '#0284c7',
        glowColor: 'rgba(6, 182, 212, 0.5)',
        borderColor: '#38bdf8',
      });

      // Cluster 1: Aliases (Top-Left Hub)
      const aHubX = centerX - 240;
      const aHubY = centerY - 140;
      aliases.forEach((node, i) => {
        const angle = (i / Math.max(aliases.length, 1)) * 2 * Math.PI;
        const r = 65 + (i % 2) * 25;
        layoutNodes.push({
          ...node,
          x: aHubX + Math.cos(angle) * r,
          y: aHubY + Math.sin(angle) * r,
          radius: 20,
          color: '#9333ea',
          glowColor: 'rgba(168, 85, 247, 0.4)',
          borderColor: '#c084fc',
        });
      });

      // Cluster 2: Platforms & Social (Top-Right Hub)
      const pHubX = centerX + 240;
      const pHubY = centerY - 130;
      platforms.forEach((node, i) => {
        const angle = (i / Math.max(platforms.length, 1)) * 2 * Math.PI;
        const r = 75 + (i % 2) * 30;
        layoutNodes.push({
          ...node,
          x: pHubX + Math.cos(angle) * r,
          y: pHubY + Math.sin(angle) * r,
          radius: 22,
          color: '#2563eb',
          glowColor: 'rgba(59, 130, 246, 0.4)',
          borderColor: '#60a5fa',
        });
      });

      // Cluster 3: Organizations (Bottom-Left Hub)
      const oHubX = centerX - 250;
      const oHubY = centerY + 150;
      orgs.forEach((node, i) => {
        const angle = (i / Math.max(orgs.length, 1)) * 2 * Math.PI;
        const r = 60 + (i % 2) * 20;
        layoutNodes.push({
          ...node,
          x: oHubX + Math.cos(angle) * r,
          y: oHubY + Math.sin(angle) * r,
          radius: 22,
          color: '#059669',
          glowColor: 'rgba(16, 185, 129, 0.4)',
          borderColor: '#34d399',
        });
      });

      // Cluster 4: Projects & Code (Bottom-Center Hub)
      const prHubX = centerX;
      const prHubY = centerY + 180;
      projects.forEach((node, i) => {
        const angle = (i / Math.max(projects.length, 1)) * Math.PI + Math.PI * 0.1;
        const r = 70 + (i % 2) * 25;
        layoutNodes.push({
          ...node,
          x: prHubX + Math.cos(angle) * r,
          y: prHubY + Math.sin(angle) * r,
          radius: 21,
          color: '#d97706',
          glowColor: 'rgba(245, 158, 11, 0.4)',
          borderColor: '#fbbf24',
        });
      });

      // Cluster 5: Events, Talks & Patents (Bottom-Right Hub)
      const eHubX = centerX + 260;
      const eHubY = centerY + 150;
      const outerNodes = [...events, ...patents, ...others];
      outerNodes.forEach((node, i) => {
        const angle = (i / Math.max(outerNodes.length, 1)) * 2 * Math.PI;
        const r = 65 + (i % 2) * 25;
        const isPatent = node.type === 'patent';
        layoutNodes.push({
          ...node,
          x: eHubX + Math.cos(angle) * r,
          y: eHubY + Math.sin(angle) * r,
          radius: 19,
          color: isPatent ? '#4f46e5' : '#e11d48',
          glowColor: isPatent ? 'rgba(99, 102, 241, 0.4)' : 'rgba(244, 63, 94, 0.4)',
          borderColor: isPatent ? '#818cf8' : '#fb7185',
        });
      });
    } else {
      // Concentric Radar Orbit Layout
      // Center Node (Subject)
      layoutNodes.push({
        ...centerNode,
        x: centerX,
        y: centerY,
        radius: 34,
        color: '#0284c7', // Sky cyan
        glowColor: 'rgba(6, 182, 212, 0.45)',
        borderColor: '#38bdf8',
      });

      // Orbit 1: Aliases (Radius ~135)
      aliases.forEach((node, i) => {
        const angle = (i / Math.max(aliases.length, 1)) * 2 * Math.PI - Math.PI / 2;
        const r = 135;
        layoutNodes.push({
          ...node,
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r,
          radius: 20,
          color: '#9333ea',
          glowColor: 'rgba(168, 85, 247, 0.35)',
          borderColor: '#c084fc',
        });
      });

      // Orbit 2: Platforms (Radius ~210)
      platforms.forEach((node, i) => {
        const offset = Math.PI / 6;
        const angle = (i / Math.max(platforms.length, 1)) * 2 * Math.PI + offset;
        const r = 210;
        layoutNodes.push({
          ...node,
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r,
          radius: 22,
          color: '#2563eb',
          glowColor: 'rgba(59, 130, 246, 0.35)',
          borderColor: '#60a5fa',
        });
      });

      // Orbit 3: Organizations & Affiliations (Radius ~270)
      orgs.forEach((node, i) => {
        const angle = (i / Math.max(orgs.length, 1)) * Math.PI + Math.PI * 0.8;
        const r = 270;
        layoutNodes.push({
          ...node,
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r,
          radius: 22,
          color: '#059669',
          glowColor: 'rgba(16, 185, 129, 0.35)',
          borderColor: '#34d399',
        });
      });

      // Orbit 4: Projects & Repositories (Radius ~270 opposite)
      projects.forEach((node, i) => {
        const angle = (i / Math.max(projects.length, 1)) * Math.PI - Math.PI * 0.2;
        const r = 270;
        layoutNodes.push({
          ...node,
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r,
          radius: 21,
          color: '#d97706',
          glowColor: 'rgba(245, 158, 11, 0.35)',
          borderColor: '#fbbf24',
        });
      });

      // Outer Ring: Events & Patents
      const outerNodes = [...events, ...patents, ...others];
      outerNodes.forEach((node, i) => {
        const angle = (i / Math.max(outerNodes.length, 1)) * 2 * Math.PI;
        const r = 300;
        const isPatent = node.type === 'patent';
        layoutNodes.push({
          ...node,
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r,
          radius: 19,
          color: isPatent ? '#4f46e5' : '#e11d48',
          glowColor: isPatent ? 'rgba(99, 102, 241, 0.35)' : 'rgba(244, 63, 94, 0.35)',
          borderColor: isPatent ? '#818cf8' : '#fb7185',
        });
      });
    }

    // Map links with coordinates
    const nodeMap = new Map<string, LayoutNode>();
    layoutNodes.forEach(n => {
      nodeMap.set(n.id, n);
      nodeMap.set(n.label.toLowerCase(), n);
    });

    const layoutLinks = rawLinks.map(l => {
      const sourceNode = nodeMap.get(l.source) || nodeMap.get(l.source.toLowerCase()) || layoutNodes[0];
      const targetNode = nodeMap.get(l.target) || nodeMap.get(l.target.toLowerCase()) || layoutNodes[1] || layoutNodes[0];
      return {
        ...l,
        sourceNode,
        targetNode,
      };
    }).filter(l => l.sourceNode && l.targetNode);

    return { nodes: layoutNodes, links: layoutLinks };
  }, [graph, subjectName, centerX, centerY]);

  // Set default selection to center node
  useEffect(() => {
    if (layout.nodes.length > 0 && !selectedNode) {
      setSelectedNode(layout.nodes[0]);
    }
  }, [layout.nodes, selectedNode]);

  // Filtering
  const filteredNodes = useMemo(() => {
    return layout.nodes.filter(node => {
      const matchesSearch = searchTerm === '' || 
        node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.type.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterCategory === 'all') return true;
      if (filterCategory === 'identity' && (node.type === 'identity' || node.type === 'alias')) return true;
      if (filterCategory === 'platform' && node.type === 'platform') return true;
      if (filterCategory === 'org' && node.type === 'organization') return true;
      if (filterCategory === 'project' && node.type === 'project') return true;
      if (filterCategory === 'event' && (node.type === 'event' || node.type === 'patent')) return true;
      return true;
    });
  }, [layout.nodes, filterCategory, searchTerm]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Connected links for selected node
  const activeNodeId = hoveredNodeId || selectedNode?.id;
  const connectedNodeIds = useMemo(() => {
    if (!activeNodeId) return new Set<string>();
    const set = new Set<string>([activeNodeId]);
    layout.links.forEach(l => {
      if (l.sourceNode?.id === activeNodeId) set.add(l.targetNode.id);
      if (l.targetNode?.id === activeNodeId) set.add(l.sourceNode.id);
    });
    return set;
  }, [activeNodeId, layout.links]);

  const activeLinks = useMemo(() => {
    if (!selectedNode) return [];
    return layout.links.filter(l => 
      l.sourceNode?.id === selectedNode.id || l.targetNode?.id === selectedNode.id
    );
  }, [selectedNode, layout.links]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'identity': return <User className="w-4 h-4 text-cyan-300" />;
      case 'alias': return <AtSign className="w-3.5 h-3.5 text-purple-300" />;
      case 'platform': return <Globe className="w-3.5 h-3.5 text-blue-300" />;
      case 'organization': return <Building2 className="w-3.5 h-3.5 text-emerald-300" />;
      case 'project': return <Code2 className="w-3.5 h-3.5 text-amber-300" />;
      case 'event': return <Trophy className="w-3.5 h-3.5 text-rose-300" />;
      case 'patent': return <Lightbulb className="w-3.5 h-3.5 text-indigo-300" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-slate-300" />;
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Top Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-950/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/80">
              <Network className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Topological Identity & Provenance Graph</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                LIVE TOPOLOGY
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Correlated entity relationships across aliases, platforms, affiliations, repositories, and patent disclosures
          </p>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Method Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700/80">
            <button
              type="button"
              onClick={() => setViewMode('orbit')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'orbit' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Radar Orbit</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cluster')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'cluster' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-3 h-3" />
              <span>Force Cluster</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'matrix' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Entity Matrix</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'identity', label: 'Identity' },
              { id: 'platform', label: 'Platforms' },
              { id: 'org', label: 'Orgs' },
              { id: 'project', label: 'Code' },
              { id: 'event', label: 'Events/IP' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterCategory(tab.id)}
                className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  filterCategory === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewMode === 'matrix' ? (
        /* Interactive Entity Provenance Matrix Grid */
        <div className="p-6 bg-slate-950 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <input
                type="text"
                placeholder="Search across all entities, platforms, handles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 w-64 sm:w-80"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredNodes.length} of {layout.nodes.length} Corroborated Entities
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredNodes.map((node) => {
              const nodeLinks = layout.links.filter(l => l.sourceNode?.id === node.id || l.targetNode?.id === node.id);
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedNode?.id === node.id
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                        {getNodeIcon(node.type)}
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-slate-100 truncate max-w-[170px]">
                          {node.label}
                        </h4>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase">
                          {node.type}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                      {nodeLinks[0]?.confidence || 85}%
                    </span>
                  </div>

                  {node.detail && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-2.5 leading-relaxed">
                      {node.detail}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-500 font-mono">
                      {nodeLinks.length} Connections
                    </span>
                    {node.url && (
                      <a
                        href={node.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                      >
                        <span>Open Record</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Main Graph Canvas Area (Orbit or Cluster) */
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        {/* SVG Viewport */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="lg:col-span-8 relative bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing select-none min-h-[500px] sm:min-h-[560px] border-b lg:border-b-0 lg:border-r border-slate-800"
        >
          {/* HUD Top Controls */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search node..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 w-36 sm:w-48 shadow-lg"
              />
            </div>
          </div>

          {/* HUD Zoom Controls */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 shadow-lg backdrop-blur-md">
            <button
              type="button"
              title="Zoom In"
              onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Zoom Out"
              onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Reset View"
              onClick={resetView}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Telemetry watermark */}
          <div className="absolute bottom-3 left-3 z-10 font-mono text-[10px] text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800/80 pointer-events-none">
            <span>NODES: {layout.nodes.length}</span> · <span>EDGES: {layout.links.length}</span> · <span>ZOOM: {Math.round(zoom * 100)}%</span>
          </div>

          {/* SVG Canvas */}
          <svg 
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full min-h-[500px]"
          >
            <defs>
              {/* High-tech Cyber Matrix Grid Pattern */}
              <pattern id="cyberGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
                <circle cx="0" cy="0" r="1" fill="#0ea5e9" fillOpacity="0.25" />
              </pattern>

              {/* Glowing Gradients */}
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="canvasVignette" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0.8" />
              </radialGradient>

              {/* Edge Marker Arrows */}
              <marker id="arrowDefault" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#475569" opacity="0.6" />
              </marker>
              <marker id="arrowActive" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8" />
              </marker>
            </defs>

            {/* Background Grid */}
            <rect width="100%" height="100%" fill="url(#cyberGrid)" />
            <rect width="100%" height="100%" fill="url(#canvasVignette)" pointerEvents="none" />

            {/* Transform Group for Pan & Zoom */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} transform-origin={`${centerX} ${centerY}`}>
              
              {/* Concentric Orbit Guide Rings */}
              <circle cx={centerX} cy={centerY} r="135" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 4" opacity="0.3" />
              <circle cx={centerX} cy={centerY} r="210" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 4" opacity="0.3" />
              <circle cx={centerX} cy={centerY} r="265" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 4" opacity="0.25" />
              <circle cx={centerX} cy={centerY} r="295" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 4" opacity="0.2" />

              {/* Center Ambient Glow */}
              <circle cx={centerX} cy={centerY} r="160" fill="url(#centerGlow)" pointerEvents="none" />

              {/* Relational Links */}
              <g className="links">
                {layout.links.map((link, idx) => {
                  if (!link.sourceNode || !link.targetNode) return null;
                  const isLinkConnected = activeNodeId && 
                    (link.sourceNode.id === activeNodeId || link.targetNode.id === activeNodeId);
                  const isFaded = activeNodeId && !isLinkConnected;

                  const midX = (link.sourceNode.x + link.targetNode.x) / 2;
                  const midY = (link.sourceNode.y + link.targetNode.y) / 2;

                  return (
                    <g key={idx} opacity={isFaded ? 0.15 : 1} className="transition-opacity duration-300">
                      <line
                        x1={link.sourceNode.x}
                        y1={link.sourceNode.y}
                        x2={link.targetNode.x}
                        y2={link.targetNode.y}
                        stroke={isLinkConnected ? '#38bdf8' : '#334155'}
                        strokeWidth={isLinkConnected ? 2.5 : 1.2}
                        strokeDasharray={link.relationship.includes('suspected') || link.relationship.includes('probable') ? '4 3' : 'none'}
                        markerEnd={isLinkConnected ? 'url(#arrowActive)' : 'url(#arrowDefault)'}
                      />
                      {/* Edge Label on active */}
                      {isLinkConnected && (
                        <g transform={`translate(${midX}, ${midY})`}>
                          <rect 
                            x="-45" 
                            y="-9" 
                            width="90" 
                            height="18" 
                            rx="5" 
                            fill="#090d16" 
                            stroke="#0284c7" 
                            strokeWidth="1" 
                          />
                          <text 
                            textAnchor="middle" 
                            dy="3.5" 
                            fill="#7dd3fc" 
                            fontSize="8" 
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {link.relationship}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Entity Nodes */}
              <g className="nodes">
                {layout.nodes.map(node => {
                  const isVisible = filteredNodeIds.has(node.id);
                  const isSelected = selectedNode?.id === node.id;
                  const isHovered = hoveredNodeId === node.id;
                  const isConnected = connectedNodeIds.has(node.id);
                  const isDimmed = activeNodeId && !isConnected;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      opacity={!isVisible ? 0.1 : isDimmed ? 0.25 : 1}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(node);
                      }}
                      className="cursor-pointer transition-opacity duration-200"
                    >
                      {/* Glowing aura */}
                      {(isSelected || isHovered) && (
                        <circle
                          r={node.radius + 12}
                          fill="none"
                          stroke={node.borderColor}
                          strokeWidth="2"
                          strokeDasharray="4 2"
                          opacity="0.8"
                          className="animate-spin"
                          style={{ animationDuration: '8s' }}
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        r={node.radius}
                        fill={node.color}
                        stroke={isSelected ? '#ffffff' : node.borderColor}
                        strokeWidth={isSelected ? 3 : 2}
                        filter="drop-shadow(0 0 10px rgba(0,0,0,0.7))"
                      />

                      {/* Photo inside center identity node */}
                      {node.type === 'identity' && photoUrl ? (
                        <clipPath id={`avatarClip-${node.id}`}>
                          <circle r={node.radius - 3} />
                        </clipPath>
                      ) : null}

                      {node.type === 'identity' && photoUrl ? (
                        <image
                          href={photoUrl}
                          x={-(node.radius - 3)}
                          y={-(node.radius - 3)}
                          width={(node.radius - 3) * 2}
                          height={(node.radius - 3) * 2}
                          clipPath={`url(#avatarClip-${node.id})`}
                        />
                      ) : (
                        <text
                          textAnchor="middle"
                          dy="4"
                          fill="#ffffff"
                          fontSize={node.type === 'identity' ? '14' : '10'}
                          fontWeight="bold"
                          pointerEvents="none"
                        >
                          {node.type === 'identity' ? '★' : node.type === 'alias' ? '@' : '●'}
                        </text>
                      )}

                      {/* Node Label below */}
                      <text
                        textAnchor="middle"
                        y={node.radius + 14}
                        fill={isSelected ? '#ffffff' : '#cbd5e1'}
                        fontSize={node.type === 'identity' ? '12' : '10'}
                        fontWeight={isSelected ? 'bold' : '600'}
                        filter="drop-shadow(0 1px 2px #000)"
                        className="select-none pointer-events-none"
                      >
                        {node.label.length > 20 ? node.label.slice(0, 18) + '...' : node.label}
                      </text>

                      {/* Node Sub-type pill */}
                      <text
                        textAnchor="middle"
                        y={node.radius + 24}
                        fill="#64748b"
                        fontSize="8"
                        fontFamily="monospace"
                        className="select-none pointer-events-none"
                      >
                        {node.type.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </g>

            </g>
          </svg>
        </div>

        {/* Entity Inspector Side-Panel */}
        <div className="lg:col-span-4 bg-slate-900/90 p-5 flex flex-col justify-between border-t lg:border-t-0 border-slate-800">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <Info className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Entity Inspector
                </span>
              </div>
              {selectedNode && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  ID: {selectedNode.id}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                {/* Node Title & Category Card */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Entity Classification
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {getNodeIcon(selectedNode.type)}
                      {selectedNode.type.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-100 break-words">
                    {selectedNode.label}
                  </h4>
                  {selectedNode.detail && (
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {selectedNode.detail}
                    </p>
                  )}
                  {selectedNode.url && (
                    <a
                      href={selectedNode.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold pt-1"
                    >
                      <span>Direct Public Profile / Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Connected Edges & Confidence */}
                <div>
                  <h5 className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                      Connected Corroboration Edges
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {activeLinks.length} connections
                    </span>
                  </h5>

                  {activeLinks.length > 0 ? (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {activeLinks.map((link, idx) => (
                        <div 
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-200 truncate">
                              {link.sourceNode?.id === selectedNode.id 
                                ? `↳ ${link.targetNode?.label}` 
                                : `↲ ${link.sourceNode?.label}`}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-800/80">
                              {link.confidence}% Conf
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Relation: <span className="text-cyan-400">[{link.relationship}]</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-500 text-center">
                      No direct graph edges recorded for this entity.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                Select any node on the graph canvas to inspect its relational footprint and verification evidence.
              </div>
            )}
          </div>

          {/* Graph Legend & Tip */}
          <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Interactive Controls:</span>
              <span className="font-mono text-cyan-400">Drag to Pan · Scroll to Zoom</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-cyan-400 font-bold">● Identity</span>
              <span className="flex items-center gap-1 text-purple-400 font-bold">● Alias</span>
              <span className="flex items-center gap-1 text-blue-400 font-bold">● Platform</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">● Organization</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">● Project</span>
              <span className="flex items-center gap-1 text-rose-400 font-bold">● Event</span>
              <span className="flex items-center gap-1 text-indigo-400 font-bold">● Patent</span>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
