import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Grid } from '@react-three/drei';
import * as THREE from 'three';
import EquipmentModel from './EquipmentModel';
import { RotateCw, Eye, Compass, Layers, Sun, Boxes, Minimize2, Tag } from 'lucide-react';

// Preset camera positions & targets - Optimized for 8.5" W × 2.5" H × 6.0" D framing
const CAMERA_PRESETS = {
  iso: {
    name: '3D Isometric',
    position: [7.8, 4.8, 8.8],
    target: [0, 0, 0]
  },
  front: {
    name: 'Front View (MIO Face)',
    position: [0, 0, 9.2],
    target: [0, 0, 0]
  },
  rear: {
    name: 'Rear View (Unverified Arrangement)',
    position: [0, 0, -9.2],
    target: [0, 0, 0]
  },
  side: {
    name: 'Side View (Ventilation)',
    position: [9.6, 0.1, 0],
    target: [0, 0, 0]
  },
  top: {
    name: 'Top View (Cooling Heatsink)',
    position: [0, 10.4, 0.05],
    target: [0, 0, 0]
  }
};

// Smooth Camera Controller that responds to preset changes
function CameraAnimator({ desiredView, controlsRef }) {
  const { camera } = useThree();
  const animatingRef = useRef(false);
  const targetPos = useRef(new THREE.Vector3(...CAMERA_PRESETS.iso.position));
  const targetLook = useRef(new THREE.Vector3(...CAMERA_PRESETS.iso.target));

  useEffect(() => {
    if (desiredView && CAMERA_PRESETS[desiredView]) {
      const preset = CAMERA_PRESETS[desiredView];
      targetPos.current.set(...preset.position);
      targetLook.current.set(...preset.target);
      animatingRef.current = true;
    }
  }, [desiredView]);

  useFrame((_, delta) => {
    if (!animatingRef.current || !controlsRef.current) return;

    const step = Math.min(delta * 4.5, 1);
    camera.position.lerp(targetPos.current, step);
    controlsRef.current.target.lerp(targetLook.current, step);
    controlsRef.current.update();

    if (
      camera.position.distanceTo(targetPos.current) < 0.05 &&
      controlsRef.current.target.distanceTo(targetLook.current) < 0.05
    ) {
      camera.position.copy(targetPos.current);
      controlsRef.current.target.copy(targetLook.current);
      controlsRef.current.update();
      animatingRef.current = false;
    }
  });

  return null;
}

// Real-time 3D to 2D Screen Projection for CAD Leader Lines
function LeaderLineTracker({
  containerRef,
  labelRefs,
  lineElsRef,
  dotElsRef,
  svgLayerRef,
  isExploded,
  showLabels,
  selectedId,
  hoveredId
}) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  const animT = useRef(0);

  useFrame((_, delta) => {
    const container = containerRef.current;
    const svgLayer = svgLayerRef.current;
    if (!container || !svgLayer) return;

    // Smoothly damp animation factor
    animT.current = THREE.MathUtils.damp(animT.current, isExploded ? 1 : 0, 5.5, delta);
    const t = animT.current;

    // Hide if closed or labels disabled
    if (!isExploded || !showLabels || t < 0.05) {
      if (svgLayer.style.display !== 'none') {
        svgLayer.style.display = 'none';
      }
      return;
    }

    if (svgLayer.style.display !== 'block') {
      svgLayer.style.display = 'block';
    }

    const containerRect = container.getBoundingClientRect();
    const halfD = 3.0;
    const chassisCenterY = -0.45;

    // Helper to project 3D world coordinates to screen pixel coordinates
    const project = (x, y, z) => {
      v.set(x, y, z);
      v.project(camera);
      const isVisible = v.z < 1.0;
      const sx = (v.x * 0.5 + 0.5) * size.width;
      const sy = (-v.y * 0.5 + 0.5) * size.height;
      return { x: sx, y: sy, visible: isVisible };
    };

    // Subsystem hardware target points matching EquipmentModel transforms
    const targets = {
      heatsink: project(0, 0.35 + 2.80 * t + 0.36, 0),
      power: project(-1.90, chassisCenterY + 0.15, halfD + 0.01 + 1.20 * t),
      rear: project(0, chassisCenterY, -halfD - 0.005 - 1.80 * t),
      blade: project(2.45, -0.05 + 0.40 * t, halfD + 0.01 + 3.80 * t),
      vb: project(1.55 - 0.45 * t, -0.80 - 0.25 * t, halfD + 0.01 + 2.80 * t),
      ge: project(3.37 + 0.45 * t, -0.80 - 0.25 * t, halfD + 0.01 + 2.80 * t)
    };

    const keys = ['heatsink', 'power', 'rear', 'blade', 'vb', 'ge'];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const labelEl = labelRefs.current[key];
      const polylineEl = lineElsRef.current[key];
      const circleEl = dotElsRef.current[key];

      if (!labelEl || !polylineEl || !circleEl) continue;

      const target = targets[key];
      if (!target.visible) {
        polylineEl.setAttribute('visibility', 'hidden');
        circleEl.setAttribute('visibility', 'hidden');
        continue;
      }

      polylineEl.setAttribute('visibility', 'visible');
      circleEl.setAttribute('visibility', 'visible');

      const labelRect = labelEl.getBoundingClientRect();
      const isLeft = key === 'heatsink' || key === 'power' || key === 'rear';

      let originX, originY, elbowX, elbowY;
      if (isLeft) {
        originX = labelRect.right - containerRect.left;
        originY = labelRect.top + labelRect.height / 2 - containerRect.top;
        elbowX = originX + 22;
        elbowY = originY;
      } else {
        originX = labelRect.left - containerRect.left;
        originY = labelRect.top + labelRect.height / 2 - containerRect.top;
        elbowX = originX - 22;
        elbowY = originY;
      }

      // Format polyline points: start -> horizontal shoulder -> 3D target pin
      polylineEl.setAttribute(
        'points',
        `${originX.toFixed(1)},${originY.toFixed(1)} ${elbowX.toFixed(1)},${elbowY.toFixed(1)} ${target.x.toFixed(1)},${target.y.toFixed(1)}`
      );
      circleEl.setAttribute('cx', target.x.toFixed(1));
      circleEl.setAttribute('cy', target.y.toFixed(1));

      // Style highlight if active/selected or hovered
      const isSelected =
        (key === 'heatsink' && selectedId === 'chassis-heatsink') ||
        (key === 'power' && ['pwr-1', 'pwr-2', 'pwr-led-1', 'pwr-led-2', 'ref-in', 'chassis-frame'].includes(selectedId)) ||
        (key === 'rear' && (selectedId?.startsWith('net-') || selectedId?.startsWith('mgmt-'))) ||
        (key === 'blade' && selectedId?.startsWith('blade-')) ||
        (key === 'vb' && selectedId?.startsWith('vb-')) ||
        (key === 'ge' && selectedId?.startsWith('ge-'));

      const isHovered =
        (key === 'heatsink' && hoveredId === 'chassis-heatsink') ||
        (key === 'power' && ['pwr-1', 'pwr-2', 'pwr-led-1', 'pwr-led-2', 'ref-in', 'chassis-frame'].includes(hoveredId)) ||
        (key === 'rear' && (hoveredId?.startsWith('net-') || hoveredId?.startsWith('mgmt-'))) ||
        (key === 'blade' && hoveredId?.startsWith('blade-')) ||
        (key === 'vb' && hoveredId?.startsWith('vb-')) ||
        (key === 'ge' && hoveredId?.startsWith('ge-'));

      if (isSelected || isHovered) {
        polylineEl.setAttribute('stroke', '#FFD500');
        polylineEl.setAttribute('stroke-width', isSelected ? '1.8' : '1.5');
        polylineEl.setAttribute('opacity', '1');
        circleEl.setAttribute('r', '3.5');
        circleEl.setAttribute('fill', '#FFD500');
      } else {
        polylineEl.setAttribute('stroke', 'rgba(255, 213, 0, 0.65)');
        polylineEl.setAttribute('stroke-width', '1.1');
        polylineEl.setAttribute('opacity', '0.85');
        circleEl.setAttribute('r', '2.5');
        circleEl.setAttribute('fill', key === 'rear' ? '#f59e0b' : '#FFD500');
      }
    }
  });

  return null;
}

export default function EquipmentViewer({
  selectedId,
  hoveredId,
  onHover,
  onUnhover,
  onSelect,
  activeView = 'iso',
  onViewChange,
  exploded = false,
  onExplodedChange
}) {
  const containerRef = useRef();
  const controlsRef = useRef();
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [localExploded, setLocalExploded] = useState(false);

  // References for CAD leader line tracker
  const labelRefs = useRef({});
  const lineElsRef = useRef({});
  const dotElsRef = useRef({});
  const svgLayerRef = useRef();

  // Controlled or uncontrolled exploded state
  const isExploded = onExplodedChange ? exploded : localExploded;
  const setExploded = onExplodedChange || setLocalExploded;

  // Helper checks for CAD labels
  const isSubsystemSelected = (key) => {
    if (!selectedId) return false;
    if (key === 'heatsink') return selectedId === 'chassis-heatsink';
    if (key === 'power') return ['pwr-1', 'pwr-2', 'pwr-led-1', 'pwr-led-2', 'ref-in', 'chassis-frame'].includes(selectedId);
    if (key === 'rear') return selectedId.startsWith('net-') || selectedId.startsWith('mgmt-');
    if (key === 'blade') return selectedId.startsWith('blade-');
    if (key === 'vb') return selectedId.startsWith('vb-');
    if (key === 'ge') return selectedId.startsWith('ge-');
    return false;
  };

  const isSubsystemHovered = (key) => {
    if (!hoveredId) return false;
    if (key === 'heatsink') return hoveredId === 'chassis-heatsink';
    if (key === 'power') return ['pwr-1', 'pwr-2', 'pwr-led-1', 'pwr-led-2', 'ref-in', 'chassis-frame'].includes(hoveredId);
    if (key === 'rear') return hoveredId.startsWith('net-') || hoveredId.startsWith('mgmt-');
    if (key === 'blade') return hoveredId.startsWith('blade-');
    if (key === 'vb') return hoveredId.startsWith('vb-');
    if (key === 'ge') return hoveredId.startsWith('ge-');
    return false;
  };

  // Reset to default view & assemble chassis
  const handleReset = () => {
    onViewChange('iso');
    setAutoRotate(false);
    setExploded(false);
  };

  return (
    <div className="viewer-container" ref={containerRef}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: CAMERA_PRESETS.iso.position, fov: 38, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08
        }}
      >
        {/* Neutral Light Grey Studio Environment (#D8D8D3) */}
        <color attach="background" args={['#D8D8D3']} />

        {/* Ambient Illumination - Soft, even illumination to reveal dark chassis details */}
        <ambientLight intensity={1.25} color="#ffffff" />
        
        {/* Strong Neutral White Key Light (Upper Front Right, soft shadows) */}
        <directionalLight
          position={[9, 14, 11]}
          intensity={2.3}
          color="#ffffff"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
          shadow-camera-left={-9}
          shadow-camera-right={9}
          shadow-camera-top={9}
          shadow-camera-bottom={-9}
          shadow-camera-near={0.5}
          shadow-camera-far={40}
        />

        {/* Soft Fill Light (Front Left - reveals left fascia, power connectors, and logos) */}
        <directionalLight position={[-11, 8, 10]} intensity={1.55} color="#ffffff" />

        {/* Overhead Fin Light (Directly above heatsink - illuminates parallel fin valleys & emblem) */}
        <directionalLight position={[0, 16, 0]} intensity={1.35} color="#ffffff" />

        {/* Rim Light (High Upper Rear - separates dark graphite equipment from background with crisp edge highlight) */}
        <directionalLight position={[-6, 12, -12]} intensity={1.4} color="#ffffff" />

        {/* Secondary Rear Fill (Illuminates rear network trunk & SFP ports) */}
        <directionalLight position={[8, 7, -10]} intensity={1.1} color="#ffffff" />

        {/* Subtle Ground Bounce Fill */}
        <directionalLight position={[0, -8, 2]} intensity={0.35} color="#deded9" />

        {/* The 3D Equipment Model */}
        <group position={[0, 0, 0]}>
          <EquipmentModel
            selectedId={selectedId}
            hoveredId={hoveredId}
            onHover={onHover}
            onUnhover={onUnhover}
            onSelect={onSelect}
            wireframe={wireframe}
            exploded={isExploded}
          />
        </group>

        {/* Soft Studio Floor Contact Shadow beneath equipment */}
        <ContactShadows
          position={[0, -1.26, 0]}
          opacity={0.52}
          scale={20}
          blur={2.4}
          far={4}
          color="#1a1a1c"
        />

        {/* Subtle Light Grey Technical Studio Grid */}
        {showGrid && (
          <Grid
            position={[0, -1.27, 0]}
            args={[32, 32]}
            cellSize={0.8}
            cellThickness={0.7}
            cellColor="#C8C8C2"
            sectionSize={4}
            sectionThickness={1.0}
            sectionColor="#B6B6AF"
            fadeDistance={22}
            fadeStrength={1.5}
          />
        )}

        {/* Orbit Camera Controls */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={3.5}
          maxDistance={28}
          maxPolarAngle={Math.PI / 2 + 0.08} // Prevent going fully underneath
          autoRotate={autoRotate}
          autoRotateSpeed={1.0}
        />

        {/* Camera Animator helper for smooth transitions */}
        <CameraAnimator desiredView={activeView} controlsRef={controlsRef} />

        {/* Real-time CAD Leader Line 3D Projection Tracker */}
        <LeaderLineTracker
          containerRef={containerRef}
          labelRefs={labelRefs}
          lineElsRef={lineElsRef}
          dotElsRef={dotElsRef}
          svgLayerRef={svgLayerRef}
          isExploded={isExploded}
          showLabels={showLabels}
          selectedId={selectedId}
          hoveredId={hoveredId}
        />
      </Canvas>

      {/* CAD Perimeter Callout Labels (Left & Right Flanks) */}
      {isExploded && showLabels && (
        <div className="cad-perimeter-overlay">
          {/* Left Column Labels */}
          <div className="cad-labels-column left-column">
            <div
              ref={(el) => { if (el) labelRefs.current['heatsink'] = el; }}
              className={`cad-perimeter-pill ${isSubsystemSelected('heatsink') ? 'selected' : ''} ${isSubsystemHovered('heatsink') ? 'hovered' : ''}`}
              onClick={() => onSelect('chassis-heatsink')}
              onPointerEnter={(e) => onHover('chassis-heatsink', e)}
              onPointerLeave={() => onUnhover('chassis-heatsink')}
              title="Click to inspect Heatsink specifications"
            >
              <span className="cad-pill-indicator" />
              <span className="cad-pill-text">COOLING SYSTEM — Heatsink</span>
            </div>

            <div
              ref={(el) => { if (el) labelRefs.current['power'] = el; }}
              className={`cad-perimeter-pill ${isSubsystemSelected('power') ? 'selected' : ''} ${isSubsystemHovered('power') ? 'hovered' : ''}`}
              onClick={() => onSelect('pwr-1')}
              onPointerEnter={(e) => onHover('pwr-1', e)}
              onPointerLeave={() => onUnhover('pwr-1')}
              title="Click to inspect Front Power & Genlock specifications"
            >
              <span className="cad-pill-indicator" />
              <span className="cad-pill-text">POWER — Front Power & Reference</span>
            </div>

            <div
              ref={(el) => { if (el) labelRefs.current['rear'] = el; }}
              className={`cad-perimeter-pill unverified ${isSubsystemSelected('rear') ? 'selected' : ''} ${isSubsystemHovered('rear') ? 'hovered' : ''}`}
              onClick={() => onSelect('net-port-1')}
              onPointerEnter={(e) => onHover('net-port-1', e)}
              onPointerLeave={() => onUnhover('net-port-1')}
              title="Click to inspect Rear Optical Panel specifications (Unverified Layout)"
            >
              <span className="cad-pill-indicator unverified-dot" />
              <span className="cad-pill-text">REAR PANEL — Unverified Arrangement</span>
            </div>
          </div>

          {/* Right Column Labels */}
          <div className="cad-labels-column right-column">
            <div
              ref={(el) => { if (el) labelRefs.current['blade'] = el; }}
              className={`cad-perimeter-pill ${isSubsystemSelected('blade') ? 'selected' : ''} ${isSubsystemHovered('blade') ? 'hovered' : ''}`}
              onClick={() => onSelect('blade-plate')}
              onPointerEnter={(e) => onHover('blade-plate', e)}
              onPointerLeave={() => onUnhover('blade-plate')}
              title="Click to inspect MIO-BLADE-Z21 specifications"
            >
              <span className="cad-pill-indicator" />
              <span className="cad-pill-text">BAY 1 & 2 — MIO-BLADE-Z21</span>
            </div>

            <div
              ref={(el) => { if (el) labelRefs.current['vb'] = el; }}
              className={`cad-perimeter-pill ${isSubsystemSelected('vb') ? 'selected' : ''} ${isSubsystemHovered('vb') ? 'hovered' : ''}`}
              onClick={() => onSelect('vb-plate')}
              onPointerEnter={(e) => onHover('vb-plate', e)}
              onPointerLeave={() => onUnhover('vb-plate')}
              title="Click to inspect MIO-VB-2-12G specifications"
            >
              <span className="cad-pill-indicator" />
              <span className="cad-pill-text">BAY 3 — MIO-VB-2-12G</span>
            </div>

            <div
              ref={(el) => { if (el) labelRefs.current['ge'] = el; }}
              className={`cad-perimeter-pill ${isSubsystemSelected('ge') ? 'selected' : ''} ${isSubsystemHovered('ge') ? 'hovered' : ''}`}
              onClick={() => onSelect('ge-plate')}
              onPointerEnter={(e) => onHover('ge-plate', e)}
              onPointerLeave={() => onUnhover('ge-plate')}
              title="Click to inspect MIO-GE-RJ45-IP specifications"
            >
              <span className="cad-pill-indicator" />
              <span className="cad-pill-text">BAY 4 — MIO-GE-RJ45-IP</span>
            </div>
          </div>
        </div>
      )}

      {/* SVG Leader Lines Layer (Dynamically updated via DOM refs on each frame) */}
      <svg
        className="cad-leader-lines-layer"
        ref={svgLayerRef}
        style={{ display: isExploded && showLabels ? 'block' : 'none' }}
      >
        {['heatsink', 'power', 'rear', 'blade', 'vb', 'ge'].map((key) => (
          <g key={key} id={`cad-leader-group-${key}`}>
            <polyline
              ref={(el) => { if (el) lineElsRef.current[key] = el; }}
              fill="none"
              stroke="rgba(255, 213, 0, 0.65)"
              strokeWidth="1.1"
            />
            <circle
              ref={(el) => { if (el) dotElsRef.current[key] = el; }}
              r="2.5"
              fill={key === 'rear' ? '#f59e0b' : '#FFD500'}
            />
          </g>
        ))}
      </svg>

      {/* Top Application Toolbar: Separated Camera Presets (Left) & Viewer Actions (Right) */}
      <div className="viewer-top-toolbar">
        {/* Left Group: Camera Preset Navigation */}
        <div className="toolbar-presets-group" role="toolbar" aria-label="Camera Presets">
          <button
            className={`hud-btn ${activeView === 'iso' ? 'active' : ''}`}
            onClick={() => onViewChange('iso')}
            title="Isometric Perspective View [1]"
          >
            <Compass size={14} />
            <span>Isometric</span>
          </button>
          <button
            className={`hud-btn ${activeView === 'front' ? 'active' : ''}`}
            onClick={() => onViewChange('front')}
            title="Front View: Modular MIO Blades & Video Connectors [2]"
          >
            <Eye size={14} />
            <span>Front (MIO)</span>
          </button>
          <button
            className={`hud-btn ${activeView === 'rear' ? 'active' : ''}`}
            onClick={() => onViewChange('rear')}
            title="Rear View: 4 SFP Ports (Physical Arrangement Unverified) [3]"
          >
            <Layers size={14} />
            <span>Rear (Unverified)</span>
          </button>
          <button
            className={`hud-btn ${activeView === 'side' ? 'active' : ''}`}
            onClick={() => onViewChange('side')}
            title="Side View: Cross-Flow Ventilation [4]"
          >
            <span>Side (Vents)</span>
          </button>
          <button
            className={`hud-btn ${activeView === 'top' ? 'active' : ''}`}
            onClick={() => onViewChange('top')}
            title="Top View: Extrusion Heatsink Profile [5]"
          >
            <span>Top (Heatsink)</span>
          </button>
        </div>

        {/* Right Group: Viewer Action Controls */}
        <div className="toolbar-actions-group" role="toolbar" aria-label="Viewer Actions">
          <button
            className={`tool-btn exploded-tool-btn ${isExploded ? 'active' : ''}`}
            onClick={() => setExploded(!isExploded)}
            title={isExploded ? "Assemble Equipment (Exit Exploded View) [E]" : "Decompose Subsystems (Exploded View) [E]"}
          >
            <Boxes size={15} />
          </button>
          {isExploded && (
            <button
              className={`tool-btn ${showLabels ? 'active' : ''}`}
              onClick={() => setShowLabels(!showLabels)}
              title={showLabels ? "Hide CAD Component Labels" : "Show CAD Component Labels"}
            >
              <Tag size={14} />
            </button>
          )}
          <button
            className={`tool-btn ${autoRotate ? 'active' : ''}`}
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Turntable Auto-Rotation"
          >
            <RotateCw size={15} />
          </button>
          <button
            className={`tool-btn ${wireframe ? 'active' : ''}`}
            onClick={() => setWireframe(!wireframe)}
            title="Toggle Wireframe Inspection Mode"
          >
            <Layers size={15} />
          </button>
          <button
            className={`tool-btn ${showGrid ? 'active' : ''}`}
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Technical Alignment Grid"
          >
            <Sun size={15} />
          </button>
          <button
            className="tool-btn"
            onClick={handleReset}
            title="Reset Camera & Assemble Chassis [R]"
          >
            <RotateCw size={15} />
          </button>
        </div>
      </div>

      {/* Floating Assemble Control Banner when Exploded View is Active */}
      {isExploded && (
        <div className="exploded-floating-banner">
          <div className="exploded-banner-info">
            <span className="exploded-pulse-dot" />
            <span className="exploded-banner-tag">EXPLODED VIEW</span>
            <span className="exploded-banner-desc">CAD SUBSYSTEM INSPECTION</span>
          </div>

          <div className="exploded-banner-actions">
            {/* Labels ON / OFF Toggle Control */}
            <button
              className={`exploded-action-btn ${showLabels ? 'active' : ''}`}
              onClick={() => setShowLabels(!showLabels)}
              title={showLabels ? "Hide CAD Component Labels" : "Show CAD Component Labels"}
            >
              <Tag size={12} />
              <span>LABELS: {showLabels ? 'ON' : 'OFF'}</span>
            </button>

            {/* Assemble Chassis Action Button */}
            <button
              className="exploded-assemble-action-btn"
              onClick={() => setExploded(false)}
              title="Assemble all components back into chassis frame [R]"
            >
              <Minimize2 size={13} />
              <span>ASSEMBLE CHASSIS</span>
            </button>
          </div>
        </div>
      )}

      {/* Active View Label & Compass Pill */}
      <div className="viewer-compass-pill">
        <span className="pill-dot"></span>
        <span className="pill-text">{CAMERA_PRESETS[activeView]?.name || 'Perspective'}</span>
      </div>

      {/* Technical Dimensions Watermark */}
      <div className="viewer-watermark">
        <span>FRAME: EVERTZ SCORPION-4</span>
        <span>•</span>
        <span>DIMENSIONS: 8.5" W × 2.5" H × 6.0" D</span>
        <span>•</span>
        <span>
          {isExploded
            ? 'EXPLODED SUBSYSTEM VIEW • BAYS 1-4 & HEATSINK ISOLATED'
            : 'CAPACITY: 4 MIO BAYS • 4 SFP PORTS (REAR UNVERIFIED)'}
        </span>
      </div>
    </div>
  );
}
