import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Grid } from '@react-three/drei';
import * as THREE from 'three';
import EquipmentModel from './EquipmentModel';
import { RotateCw, Eye, Compass, Layers, Sun } from 'lucide-react';

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

export default function EquipmentViewer({
  selectedId,
  hoveredId,
  onHover,
  onUnhover,
  onSelect,
  activeView = 'iso',
  onViewChange
}) {
  const controlsRef = useRef();
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  // Reset to default view
  const handleReset = () => {
    onViewChange('iso');
    setAutoRotate(false);
  };

  return (
    <div className="viewer-container">
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
      </Canvas>

      {/* Floating View Presets HUD */}
      <div className="viewer-hud-presets">
        <button
          className={`hud-btn ${activeView === 'iso' ? 'active' : ''}`}
          onClick={() => onViewChange('iso')}
          title="Isometric Perspective View"
        >
          <Compass size={14} />
          <span>Isometric</span>
        </button>
        <button
          className={`hud-btn ${activeView === 'front' ? 'active' : ''}`}
          onClick={() => onViewChange('front')}
          title="Front View: Modular MIO Blades & Video Connectors"
        >
          <Eye size={14} />
          <span>Front (MIO)</span>
        </button>
        <button
          className={`hud-btn ${activeView === 'rear' ? 'active' : ''}`}
          onClick={() => onViewChange('rear')}
          title="Rear View: 4 SFP Ports (Physical Arrangement Unverified)"
        >
          <Layers size={14} />
          <span>Rear (Unverified)</span>
        </button>
        <button
          className={`hud-btn ${activeView === 'side' ? 'active' : ''}`}
          onClick={() => onViewChange('side')}
          title="Side View: Cross-Flow Ventilation"
        >
          <span>Side (Vents)</span>
        </button>
        <button
          className={`hud-btn ${activeView === 'top' ? 'active' : ''}`}
          onClick={() => onViewChange('top')}
          title="Top View: Extrusion Heatsink Profile"
        >
          <span>Top (Heatsink)</span>
        </button>
      </div>

      {/* Floating Viewer Tools HUD */}
      <div className="viewer-hud-tools">
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
          title="Reset Camera to Standard View"
        >
          <RotateCw size={15} />
        </button>
      </div>

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
        <span>CAPACITY: 4 MIO BAYS • 4 SFP PORTS (REAR UNVERIFIED)</span>
      </div>
    </div>
  );
}
