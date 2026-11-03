import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ComponentExplorer from './components/ComponentExplorer';
import ComponentDetails from './components/ComponentDetails';
import EquipmentViewer from './components/EquipmentViewer';
import Tooltip from './components/Tooltip';
import ReferenceModal from './components/ReferenceModal';
import './styles/global.css';

export default function App() {
  const [selectedId, setSelectedId] = useState('vb-bnc-a');
  const [hoveredId, setHoveredId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeView, setActiveView] = useState('iso');
  const [isRefModalOpen, setIsRefModalOpen] = useState(false);

  // Handle pointer hover from 3D canvas or sidebar
  const handleHover = useCallback((id, event) => {
    setHoveredId(id);
    if (event && event.clientX !== undefined) {
      setMousePos({ x: event.clientX, y: event.clientY });
    }
  }, []);

  const handleUnhover = useCallback((id) => {
    setHoveredId((current) => (current === id ? null : current));
  }, []);

  // Handle component selection
  const handleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  // Track global mouse move for tooltip position when hovering
  useEffect(() => {
    const onMouseMove = (e) => {
      if (hoveredId) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [hoveredId]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'Escape':
          setSelectedId(null);
          setIsRefModalOpen(false);
          break;
        case '1':
          setActiveView('iso');
          break;
        case '2':
          setActiveView('front');
          break;
        case '3':
          setActiveView('rear');
          break;
        case '4':
          setActiveView('side');
          break;
        case '5':
          setActiveView('top');
          break;
        case 'r':
        case 'R':
          setActiveView('iso');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-root">
      {/* Top Application Header */}
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        onResetView={() => setActiveView('iso')}
        onOpenReferences={() => setIsRefModalOpen(true)}
      />

      {/* Main 3-Column Studio Layout */}
      <main className="app-main-layout">
        {/* Left Column: Component Explorer Tree & Search */}
        <ComponentExplorer
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
        />

        {/* Center Column: Interactive 3D Equipment Viewer */}
        <EquipmentViewer
          selectedId={selectedId}
          hoveredId={hoveredId}
          onHover={handleHover}
          onUnhover={handleUnhover}
          onSelect={handleSelect}
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Right Column: Selected Component Engineering Details */}
        <ComponentDetails
          selectedId={selectedId}
          onClose={() => setSelectedId(null)}
          onSelectComponent={handleSelect}
          onFocusView={(view) => setActiveView(view)}
        />
      </main>

      {/* Floating 3D Hover Tooltip */}
      <Tooltip hoveredId={hoveredId} mousePos={mousePos} />

      {/* Reference Photographs Inspector Modal */}
      <ReferenceModal
        isOpen={isRefModalOpen}
        onClose={() => setIsRefModalOpen(false)}
      />
    </div>
  );
}
