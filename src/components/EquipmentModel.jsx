import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  createFrontFasciaTexture,
  createBladePlateTexture,
  createVbPlateTexture,
  createGePlateTexture,
  createRearFasciaTexture,
  createHeatsinkTopTexture,
  createSideVentTexture
} from '../utils/CanvasTextureHelper';

// Reusable standard screw mesh
function ScrewMesh({ position, rotation, radius = 0.07, headHeight = 0.04, isSocketCap = false, isHovered, isSelected, onClick, onPointerOver, onPointerOut }) {
  return (
    <group
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 0.95, headHeight, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#FFD500' : isHovered ? '#fef08a' : '#71717a'}
          metalness={0.94}
          roughness={0.22}
          emissive={isSelected ? '#FFD500' : isHovered ? '#E5B800' : '#000000'}
          emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.3 : 0}
        />
      </mesh>
      {/* Screw head indentation */}
      <mesh position={[0, headHeight * 0.51, 0]}>
        {isSocketCap ? (
          <cylinderGeometry args={[radius * 0.55, radius * 0.55, 0.01, 6]} />
        ) : (
          <boxGeometry args={[radius * 1.4, 0.01, radius * 0.25]} />
        )}
        <meshBasicMaterial color="#18181b" />
      </mesh>
    </group>
  );
}

// Full-size True 12G 75Ω BNC Connector (Used on MIO-VB-2-12G and REF IN)
function BncConnector({ id, position, rotation, hasHexNut = false, isHovered, isSelected, onHover, onUnhover, onSelect }) {
  const meshRef = useRef();

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(id, e); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(id); }}
    >
      {/* Optional Hex Nut behind connector (for REF IN bulkhead) */}
      {hasHexNut && (
        <mesh position={[0, 0, -0.05]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.10, 6]} />
          <meshStandardMaterial
            color={isSelected ? '#FFD500' : isHovered ? '#fef08a' : '#d8dbe2'}
            metalness={0.96}
            roughness={0.22}
            emissive={isSelected ? '#FFD500' : isHovered ? '#E5B800' : '#000000'}
            emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.25 : 0}
          />
        </mesh>
      )}

      {/* Main BNC Outer Ground Barrel - Polished Metallic Silver */}
      <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.36, 28]} />
        <meshStandardMaterial
          color={isSelected ? '#FFD500' : isHovered ? '#fef08a' : '#eceef2'}
          metalness={0.98}
          roughness={0.12}
          emissive={isSelected ? '#FFD500' : isHovered ? '#E5B800' : '#000000'}
          emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.3 : 0}
        />
      </mesh>

      {/* Outer Rotating Locking Collar with Knurled Band */}
      <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.18, 28]} />
        <meshStandardMaterial
          color={isSelected ? '#E5B800' : isHovered ? '#fde047' : '#cbd1dc'}
          metalness={0.94}
          roughness={0.32}
        />
      </mesh>

      {/* Dual Bayonet Locking Stud Lugs */}
      <mesh position={[0.23, 0, 0.26]}>
        <boxGeometry args={[0.07, 0.06, 0.07]} />
        <meshStandardMaterial color="#b4bac6" metalness={0.96} roughness={0.2} />
      </mesh>
      <mesh position={[-0.23, 0, 0.26]}>
        <boxGeometry args={[0.07, 0.06, 0.07]} />
        <meshStandardMaterial color="#b4bac6" metalness={0.96} roughness={0.2} />
      </mesh>

      {/* Inner White Delrin Dielectric Insulator */}
      <mesh position={[0, 0, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.15, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>

      {/* Inner Coaxial Core Cavity */}
      <mesh position={[0, 0, 0.31]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.10, 0.10, 0.12, 24]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Center Gold-Plated Signal Contact Pin - Polished Gold */}
      <mesh position={[0, 0, 0.31]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.20, 16]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.98}
          roughness={0.10}
          emissive={isSelected ? '#FFD500' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Selection Glow Ring */}
      {(isSelected || isHovered) && (
        <mesh position={[0, 0, 0.38]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.26, 0.30, 32]} />
          <meshBasicMaterial
            color={isSelected ? '#FFD500' : '#E5B800'}
            side={THREE.DoubleSide}
            transparent
            opacity={isSelected ? 0.95 : 0.65}
          />
        </mesh>
      )}
    </group>
  );
}

// Observed SDI IN/OUT Miniature Coaxial Connector (MIO-BLADE-Z21 - Exact standard unverified)
function MiniBncConnector({ id, position, isHovered, isSelected, onHover, onUnhover, onSelect }) {
  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(id, e); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(id); }}
    >
      {/* Outer Polished Gold Barrel Collar */}
      <mesh position={[0, 0, 0.10]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.20, 20]} />
        <meshStandardMaterial
          color={isSelected ? '#FFD500' : isHovered ? '#fef08a' : '#d4af37'}
          metalness={0.96}
          roughness={0.18}
          emissive={isSelected ? '#FFD500' : isHovered ? '#E5B800' : '#000000'}
          emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.3 : 0}
        />
      </mesh>

      {/* Knurled Push-Pull Retention Ring */}
      <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.10, 20]} />
        <meshStandardMaterial
          color={isSelected ? '#FFD500' : isHovered ? '#fde047' : '#caa232'}
          metalness={0.92}
          roughness={0.28}
        />
      </mesh>

      {/* Center Gold Pin */}
      <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.14, 12]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.99} roughness={0.08} />
      </mesh>

      {/* Inner Delrin Insulator */}
      <mesh position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.10, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* Selection Glow */}
      {(isSelected || isHovered) && (
        <mesh position={[0, 0, 0.22]}>
          <ringGeometry args={[0.14, 0.18, 24]} />
          <meshBasicMaterial
            color={isSelected ? '#FFD500' : '#E5B800'}
            side={THREE.DoubleSide}
            transparent
            opacity={isSelected ? 0.95 : 0.6}
          />
        </mesh>
      )}
    </group>
  );
}

// Locking Threaded 12VDC Coaxial Power Jack
function PowerConnector({ id, position, isHovered, isSelected, onHover, onUnhover, onSelect }) {
  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(id, e); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(id); }}
    >
      {/* Outer Threaded Nickel Brass Collar */}
      <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.19, 0.16, 24]} />
        <meshStandardMaterial
          color={isSelected ? '#FFD500' : isHovered ? '#fef08a' : '#cbd5e1'}
          metalness={0.96}
          roughness={0.20}
          emissive={isSelected ? '#FFD500' : isHovered ? '#E5B800' : '#000000'}
          emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.3 : 0}
        />
      </mesh>

      {/* Thread Ridges */}
      <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.205, 0.205, 0.10, 24]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.35} />
      </mesh>

      {/* Dark Inner Insulator Socket */}
      <mesh position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.12, 20]} />
        <meshBasicMaterial color="#090d16" />
      </mesh>

      {/* Center 2.5mm Power Contact Pin */}
      <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.14, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.15} />
      </mesh>

      {/* Selection Glow */}
      {(isSelected || isHovered) && (
        <mesh position={[0, 0, 0.18]}>
          <ringGeometry args={[0.22, 0.26, 28]} />
          <meshBasicMaterial
            color={isSelected ? '#FFD500' : '#E5B800'}
            side={THREE.DoubleSide}
            transparent
            opacity={isSelected ? 0.95 : 0.6}
          />
        </mesh>
      )}
    </group>
  );
}

// LED Status Indicator Light Pipe
function LedIndicator({ id, position, color = '#22c55e', isHovered, isSelected, onHover, onUnhover, onSelect }) {
  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(id, e); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(id); }}
    >
      {/* Dark Outer Recessed Bezel Ring */}
      <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Glowing Polycarbonate LED Lens */}
      <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.04, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.8 : isHovered ? 1.4 : 0.95}
          roughness={0.15}
        />
      </mesh>

      {/* Subtle Light Bloom Corona */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[0.14, 0.14]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.65 : isHovered ? 0.45 : 0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Shielded RJ45 8P8C Port
function Rj45Port({ id, position, isHovered, isSelected, onHover, onUnhover, onSelect }) {
  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(id, e); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(id); }}
    >
      {/* Outer Metal Shielded Shell Housing */}
      <mesh position={[0, 0, 0.10]} castShadow>
        <boxGeometry args={[0.62, 0.52, 0.24]} />
        <meshStandardMaterial
          color={isSelected ? '#FFD500' : isHovered ? '#fef08a' : '#cbd5e1'}
          metalness={0.92}
          roughness={0.24}
          emissive={isSelected ? '#FFD500' : isHovered ? '#E5B800' : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.25 : 0}
        />
      </mesh>

      {/* Inner Black Receptacle Cavity */}
      <mesh position={[0, -0.02, 0.17]}>
        <boxGeometry args={[0.48, 0.38, 0.14]} />
        <meshBasicMaterial color="#090d16" />
      </mesh>

      {/* Lower Tab Notch Cutout */}
      <mesh position={[0, -0.16, 0.17]}>
        <boxGeometry args={[0.22, 0.12, 0.14]} />
        <meshBasicMaterial color="#090d16" />
      </mesh>

      {/* 8 Gold Contact Pins inside cavity */}
      {[-0.14, -0.10, -0.06, -0.02, 0.02, 0.06, 0.10, 0.14].map((pinX, i) => (
        <mesh key={i} position={[pinX, 0.08, 0.18]}>
          <boxGeometry args={[0.016, 0.06, 0.10]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.98} roughness={0.1} />
        </mesh>
      ))}

      {/* Selection Border Glow */}
      {(isSelected || isHovered) && (
        <mesh position={[0, 0, 0.24]}>
          <planeGeometry args={[0.68, 0.58]} />
          <meshBasicMaterial
            color={isSelected ? '#FFD500' : '#E5B800'}
            wireframe
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
    </group>
  );
}

// Dual SFP+ / SFP Cage Assembly for Rear Trunk & WAN Interfaces
function SfpCage({ id, position, isHovered, isSelected, onHover, onUnhover, onSelect }) {
  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(id, e); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(id); }}
    >
      {/* Outer Nickel-Plated Sheet Metal EMI Cage Shell */}
      <mesh position={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.95, 0.48, 0.40]} />
        <meshStandardMaterial
          color={isSelected ? '#FFD500' : isHovered ? '#fef08a' : '#d1d5db'}
          metalness={0.92}
          roughness={0.22}
          emissive={isSelected ? '#FFD500' : isHovered ? '#E5B800' : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.25 : 0}
        />
      </mesh>

      {/* Port A Opening (Left) */}
      <mesh position={[-0.22, 0, 0.02]}>
        <boxGeometry args={[0.38, 0.36, 0.12]} />
        <meshBasicMaterial color="#0a0f1d" />
      </mesh>

      {/* Port B Opening (Right) */}
      <mesh position={[0.22, 0, 0.02]}>
        <boxGeometry args={[0.38, 0.36, 0.12]} />
        <meshBasicMaterial color="#0a0f1d" />
      </mesh>

      {/* Center Divider Rib */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.04, 0.44, 0.12]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Metal Latch Springs (EMI fingers around perimeter) */}
      <mesh position={[0, 0.22, 0.01]}>
        <boxGeometry args={[0.90, 0.03, 0.08]} />
        <meshStandardMaterial color="#6b7280" metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.22, 0.01]}>
        <boxGeometry args={[0.90, 0.03, 0.08]} />
        <meshStandardMaterial color="#6b7280" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Status LEDs A and B on the right side of cage (matching Photo 2) */}
      <mesh position={[0.55, 0.10, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.55, -0.10, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
      </mesh>

      {/* Selection Glow */}
      {(isSelected || isHovered) && (
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.05, 0.54]} />
          <meshBasicMaterial
            color={isSelected ? '#FFD500' : '#E5B800'}
            wireframe
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
    </group>
  );
}

// Micro-USB COM Console Port (Photo 2 Verified)
function MicroUsbPort({ id, position, isHovered, isSelected, onHover, onUnhover, onSelect }) {
  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(id, e); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(id); }}
    >
      {/* Outer Metal Shield Collar */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.34, 0.16, 0.08]} />
        <meshStandardMaterial
          color={isSelected ? '#FFD500' : isHovered ? '#fef08a' : '#cbd5e1'}
          metalness={0.95}
          roughness={0.2}
          emissive={isSelected ? '#FFD500' : isHovered ? '#E5B800' : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.25 : 0}
        />
      </mesh>
      {/* Inner Black Cavity */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.26, 0.10, 0.06]} />
        <meshBasicMaterial color="#090d16" />
      </mesh>
      {/* Center Tongue */}
      <mesh position={[0, -0.015, 0.05]}>
        <boxGeometry args={[0.20, 0.025, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
    </group>
  );
}

/**
 * Main 3D Model: Evertz SCORPION-4
 * Calibrated strictly to official documentation:
 * Height: 2.5 inches (63.5 mm)
 * Width: 8.5 inches (215.9 mm)
 * Depth: 6.0 inches (152.4 mm)
 */
export default function EquipmentModel({
  selectedId,
  hoveredId,
  onHover,
  onUnhover,
  onSelect,
  wireframe = false
}) {
  const groupRef = useRef();

  // Generate canvas textures once with useMemo
  const textures = useMemo(() => {
    return {
      frontFascia: createFrontFasciaTexture(),
      bladePlate: createBladePlateTexture(),
      vbPlate: createVbPlateTexture(),
      gePlate: createGePlateTexture(),
      rearFascia: createRearFasciaTexture(),
      heatsinkTop: createHeatsinkTopTexture(),
      sideVent: createSideVentTexture()
    };
  }, []);

  // Calibrated Official Proportions (1 unit = 1 inch)
  const chassisWidth = 8.5;   // 8.5" official documented width
  const chassisDepth = 6.0;   // 6.0" official documented depth
  const chassisBodyHeight = 1.6; // Main chassis metal box enclosure
  // Proportions: 1.6" chassis body + 0.9" heatsink (0.18" base + 0.72" fins) = 2.50" total height

  // Assembly is centered vertically at Y = 0:
  // Chassis bottom is at Y = -1.25, chassis top is at Y = +0.35 (height = 1.6)
  // Heatsink top is at Y = +1.25 (total height = 2.50)
  const chassisCenterY = -0.45;
  const halfW = chassisWidth / 2;  // 4.25
  const halfD = chassisDepth / 2;  // 3.00

  // Upper Heatsink Configuration (Matching Photo 1 and Photo 3)
  const numFins = 28;
  const finWidth = 8.1;
  const finDepth = 5.3;
  const finHeight = 0.72;
  const finSpacing = finWidth / (numFins - 1);

  // Helper to check hover or select state
  const isH = (id) => hoveredId === id;
  const isS = (id) => selectedId === id;

  return (
    <group ref={groupRef} dispose={null}>
      {/* ============================================================== */}
      {/* 1. MAIN CHASSIS BODY (BLACK METAL ENCLOSURE)                   */}
      {/* ============================================================== */}
      <group
        onClick={(e) => { e.stopPropagation(); onSelect('chassis-frame'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover('chassis-frame', e); }}
        onPointerOut={(e) => { e.stopPropagation(); onUnhover('chassis-frame'); }}
      >
        {/* Main Chassis Box Core */}
        <mesh castShadow receiveShadow position={[0, chassisCenterY, 0]}>
          <boxGeometry args={[chassisWidth, chassisBodyHeight, chassisDepth]} />
          <meshStandardMaterial
            color={isS('chassis-frame') ? '#26241c' : isH('chassis-frame') ? '#383a3f' : '#303236'}
            metalness={0.70}
            roughness={0.38}
            wireframe={wireframe}
            emissive={isS('chassis-frame') ? '#594400' : isH('chassis-frame') ? '#2e2300' : '#000000'}
            emissiveIntensity={isS('chassis-frame') ? 0.35 : isH('chassis-frame') ? 0.15 : 0}
          />
        </mesh>

        {/* Left Side Ventilation Perforations Plate (Photo 3 Verified) */}
        <mesh position={[-halfW - 0.005, chassisCenterY, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[chassisDepth * 0.90, chassisBodyHeight * 0.72]} />
          <meshStandardMaterial
            map={textures.sideVent}
            transparent
            roughness={0.38}
            metalness={0.72}
            wireframe={wireframe}
          />
        </mesh>

        {/* Right Side Ventilation Perforations Plate */}
        <mesh position={[halfW + 0.005, chassisCenterY, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[chassisDepth * 0.90, chassisBodyHeight * 0.72]} />
          <meshStandardMaterial
            map={textures.sideVent}
            transparent
            roughness={0.38}
            metalness={0.72}
            wireframe={wireframe}
          />
        </mesh>

        {/* Bottom Mounting Flange (Left ear with fastener slots matching Photo 3) */}
        <mesh position={[-halfW - 0.20, -1.22, 0]} castShadow>
          <boxGeometry args={[0.40, 0.06, chassisDepth * 0.96]} />
          <meshStandardMaterial color="#2b2d32" metalness={0.75} roughness={0.32} />
        </mesh>

        {/* Bottom Mounting Flange (Right ear with fastener slots matching Photo 3) */}
        <mesh position={[halfW + 0.20, -1.22, 0]} castShadow>
          <boxGeometry args={[0.40, 0.06, chassisDepth * 0.96]} />
          <meshStandardMaterial color="#2b2d32" metalness={0.75} roughness={0.32} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 2. UPPER CONVECTION COOLING HEATSINK WITH PARALLEL FINS        */}
      {/* ============================================================== */}
      <group
        position={[0, 0.35, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect('chassis-heatsink'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover('chassis-heatsink', e); }}
        onPointerOut={(e) => { e.stopPropagation(); onUnhover('chassis-heatsink'); }}
      >
        {/* Heatsink Base Plate Block */}
        <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
          <boxGeometry args={[8.1, 0.18, 5.6]} />
          <meshStandardMaterial
            color={isS('chassis-heatsink') ? '#26241c' : isH('chassis-heatsink') ? '#34363c' : '#26282d'}
            metalness={0.82}
            roughness={0.30}
            wireframe={wireframe}
            emissive={isS('chassis-heatsink') ? '#594400' : isH('chassis-heatsink') ? '#2e2300' : '#000000'}
            emissiveIntensity={isS('chassis-heatsink') ? 0.35 : isH('chassis-heatsink') ? 0.15 : 0}
          />
        </mesh>

        {/* Heatsink Front Bevel / Stepped Ledge with Cutouts (Photo 1 Verified) */}
        <mesh position={[0, 0.22, 2.70]} castShadow receiveShadow>
          <boxGeometry args={[8.1, 0.36, 0.20]} />
          <meshStandardMaterial color="#222428" metalness={0.85} roughness={0.28} wireframe={wireframe} />
        </mesh>

        {/* Heatsink Rear Bevel / Stepped Ledge */}
        <mesh position={[0, 0.22, -2.70]} castShadow receiveShadow>
          <boxGeometry args={[8.1, 0.36, 0.20]} />
          <meshStandardMaterial color="#222428" metalness={0.85} roughness={0.28} wireframe={wireframe} />
        </mesh>

        {/* 28 Parallel Extrusion Cooling Fins along Z Depth (Photo 1 & 3 Verified) */}
        {Array.from({ length: numFins }).map((_, i) => {
          const finX = -finWidth / 2 + i * finSpacing;
          return (
            <mesh
              key={i}
              position={[finX, 0.18 + finHeight / 2, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.065, finHeight, finDepth]} />
              <meshStandardMaterial
                color={isS('chassis-heatsink') ? '#332b14' : isH('chassis-heatsink') ? '#3c3f46' : '#2c2e34'}
                metalness={0.88}
                roughness={0.26}
                wireframe={wireframe}
                emissive={isS('chassis-heatsink') ? '#594400' : isH('chassis-heatsink') ? '#2e2300' : '#000000'}
                emissiveIntensity={isS('chassis-heatsink') ? 0.4 : isH('chassis-heatsink') ? 0.2 : 0}
              />
            </mesh>
          );
        })}

        {/* Heatsink Top Plate with Laser-Etched Circular Scorpion Graphic */}
        <mesh position={[0, 0.18 + finHeight + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[finWidth * 0.94, finDepth * 0.94]} />
          <meshStandardMaterial
            map={textures.heatsinkTop}
            transparent
            opacity={0.96}
            metalness={0.85}
            roughness={0.32}
            wireframe={wireframe}
          />
        </mesh>

        {/* Upper Mounting Hex Socket Cap Screws on Heatsink Ledge (Photo 1 Verified) */}
        {[-3.6, 0.0, 3.6].map((sx, idx) => (
          <ScrewMesh
            key={`hs-front-${idx}`}
            position={[sx, 0.38, 2.71]}
            rotation={[Math.PI / 2, 0, 0]}
            radius={0.08}
            isSocketCap={true}
          />
        ))}
        {[-3.6, 0.0, 3.6].map((sx, idx) => (
          <ScrewMesh
            key={`hs-rear-${idx}`}
            position={[sx, 0.38, -2.71]}
            rotation={[-Math.PI / 2, 0, 0]}
            radius={0.08}
            isSocketCap={true}
          />
        ))}
      </group>

      {/* ============================================================== */}
      {/* 3. FRONT MAIN CHASSIS FASCIA (LEFT PORTION WITH SILKSCREEN)    */}
      {/* ============================================================== */}
      <group position={[-1.90, chassisCenterY, halfD + 0.005]}>
        {/* Front Left Black Fascia Panel with Evertz & SCORPION-4 branding */}
        <mesh>
          <planeGeometry args={[4.70, chassisBodyHeight]} />
          <meshStandardMaterial
            map={textures.frontFascia}
            metalness={0.8}
            roughness={0.35}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 4. CHASSIS MOUNTED CONNECTORS (LEFT FRONT FASCIA)              */}
      {/* ============================================================== */}

      {/* 12VDC Power Connector 1 (Photo 1 Verified) */}
      <PowerConnector
        id="pwr-1"
        position={[-2.50, -0.30, halfD + 0.01]}
        isHovered={isH('pwr-1')}
        isSelected={isS('pwr-1')}
        onHover={onHover}
        onUnhover={onUnhover}
        onSelect={onSelect}
      />

      {/* Power 1 Status LED (Photo 1 Verified) */}
      <LedIndicator
        id="pwr-led-1"
        position={[-2.05, -0.30, halfD + 0.01]}
        color="#22c55e"
        isHovered={isH('pwr-led-1')}
        isSelected={isS('pwr-led-1')}
        onHover={onHover}
        onUnhover={onUnhover}
        onSelect={onSelect}
      />

      {/* 12VDC Power Connector 2 (Redundant) (Photo 1 Verified) */}
      <PowerConnector
        id="pwr-2"
        position={[-1.45, -0.30, halfD + 0.01]}
        isHovered={isH('pwr-2')}
        isSelected={isS('pwr-2')}
        onHover={onHover}
        onUnhover={onUnhover}
        onSelect={onSelect}
      />

      {/* Power 2 Status LED (Photo 1 Verified) */}
      <LedIndicator
        id="pwr-led-2"
        position={[-1.00, -0.30, halfD + 0.01]}
        color="#22c55e"
        isHovered={isH('pwr-led-2')}
        isSelected={isS('pwr-led-2')}
        onHover={onHover}
        onUnhover={onUnhover}
        onSelect={onSelect}
      />

      {/* REF IN BNC Connector with Hex Nut (Photo 1 Verified) */}
      <BncConnector
        id="ref-in"
        position={[-0.15, -0.30, halfD + 0.01]}
        rotation={[0, 0, 0]}
        hasHexNut={true}
        isHovered={isH('ref-in')}
        isSelected={isS('ref-in')}
        onHover={onHover}
        onUnhover={onUnhover}
        onSelect={onSelect}
      />

      {/* ============================================================== */}
      {/* 5. MIO-BLADE-Z21 MICROSERVICE MODULE (UPPER MODULAR BAY)       */}
      {/* ============================================================== */}
      <group position={[2.45, -0.05, halfD + 0.01]}>
        {/* Silver Brushed Faceplate */}
        <mesh
          position={[0, 0, 0]}
          onClick={(e) => { e.stopPropagation(); onSelect('blade-plate'); }}
          onPointerOver={(e) => { e.stopPropagation(); onHover('blade-plate', e); }}
          onPointerOut={(e) => { e.stopPropagation(); onUnhover('blade-plate'); }}
        >
          <planeGeometry args={[3.65, 0.68]} />
          <meshStandardMaterial
            map={textures.bladePlate}
            metalness={0.92}
            roughness={0.25}
            wireframe={wireframe}
            emissive={isS('blade-plate') ? '#594400' : isH('blade-plate') ? '#2e2300' : '#000000'}
            emissiveIntensity={isS('blade-plate') ? 0.35 : isH('blade-plate') ? 0.15 : 0}
          />
        </mesh>

        {/* Left Captive Thumbscrew (Photo 1 Verified) */}
        <ScrewMesh
          position={[-1.63, 0.20, 0.03]}
          rotation={[Math.PI / 2, 0, 0]}
          radius={0.09}
          headHeight={0.10}
          isSocketCap={false}
          isHovered={isH('blade-thumbscrew-left')}
          isSelected={isS('blade-thumbscrew-left')}
          onClick={(e) => { e.stopPropagation(); onSelect('blade-thumbscrew-left'); }}
          onPointerOver={(e) => { e.stopPropagation(); onHover('blade-thumbscrew-left', e); }}
          onPointerOut={(e) => { e.stopPropagation(); onUnhover('blade-thumbscrew-left'); }}
        />

        {/* Right Captive Thumbscrew (Photo 1 Verified) */}
        <ScrewMesh
          position={[1.63, 0.20, 0.03]}
          rotation={[Math.PI / 2, 0, 0]}
          radius={0.09}
          headHeight={0.10}
          isSocketCap={false}
          isHovered={isH('blade-thumbscrew-right')}
          isSelected={isS('blade-thumbscrew-right')}
          onClick={(e) => { e.stopPropagation(); onSelect('blade-thumbscrew-right'); }}
          onPointerOver={(e) => { e.stopPropagation(); onHover('blade-thumbscrew-right', e); }}
          onPointerOut={(e) => { e.stopPropagation(); onUnhover('blade-thumbscrew-right'); }}
        />

        {/* 4 Observed SDI OUT Miniature Coaxial Connectors (Photo 1 Verified) */}
        <MiniBncConnector
          id="blade-sdi-out-4"
          position={[-1.36, -0.11, 0]}
          isHovered={isH('blade-sdi-out-4')}
          isSelected={isS('blade-sdi-out-4')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />
        <MiniBncConnector
          id="blade-sdi-out-3"
          position={[-1.04, -0.11, 0]}
          isHovered={isH('blade-sdi-out-3')}
          isSelected={isS('blade-sdi-out-3')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />
        <MiniBncConnector
          id="blade-sdi-out-2"
          position={[-0.73, -0.11, 0]}
          isHovered={isH('blade-sdi-out-2')}
          isSelected={isS('blade-sdi-out-2')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />
        <MiniBncConnector
          id="blade-sdi-out-1"
          position={[-0.41, -0.11, 0]}
          isHovered={isH('blade-sdi-out-1')}
          isSelected={isS('blade-sdi-out-1')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />

        {/* 4 Observed SDI IN Miniature Coaxial Connectors (Photo 1 Verified) */}
        <MiniBncConnector
          id="blade-sdi-in-4"
          position={[0.27, -0.11, 0]}
          isHovered={isH('blade-sdi-in-4')}
          isSelected={isS('blade-sdi-in-4')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />
        <MiniBncConnector
          id="blade-sdi-in-3"
          position={[0.59, -0.11, 0]}
          isHovered={isH('blade-sdi-in-3')}
          isSelected={isS('blade-sdi-in-3')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />
        <MiniBncConnector
          id="blade-sdi-in-2"
          position={[0.91, -0.11, 0]}
          isHovered={isH('blade-sdi-in-2')}
          isSelected={isS('blade-sdi-in-2')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />
        <MiniBncConnector
          id="blade-sdi-in-1"
          position={[1.22, -0.11, 0]}
          isHovered={isH('blade-sdi-in-1')}
          isSelected={isS('blade-sdi-in-1')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />
      </group>

      {/* ============================================================== */}
      {/* 6. MIO-VB-2-12G VIDEO ACCESS MODULE (LOWER-LEFT MODULAR BAY)   */}
      {/* ============================================================== */}
      <group position={[1.55, -0.80, halfD + 0.01]}>
        {/* Silver Faceplate */}
        <mesh
          position={[0, 0, 0]}
          onClick={(e) => { e.stopPropagation(); onSelect('vb-plate'); }}
          onPointerOver={(e) => { e.stopPropagation(); onHover('vb-plate', e); }}
          onPointerOut={(e) => { e.stopPropagation(); onUnhover('vb-plate'); }}
        >
          <planeGeometry args={[1.76, 0.68]} />
          <meshStandardMaterial
            map={textures.vbPlate}
            metalness={0.92}
            roughness={0.25}
            wireframe={wireframe}
            emissive={isS('vb-plate') ? '#594400' : isH('vb-plate') ? '#2e2300' : '#000000'}
            emissiveIntensity={isS('vb-plate') ? 0.35 : isH('vb-plate') ? 0.15 : 0}
          />
        </mesh>

        {/* 12G-SDI BNC Port A (Photo 1 Verified) */}
        <BncConnector
          id="vb-bnc-a"
          position={[-0.40, 0.04, 0]}
          rotation={[0, 0, 0]}
          isHovered={isH('vb-bnc-a')}
          isSelected={isS('vb-bnc-a')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />

        {/* 12G-SDI BNC Port B (Photo 1 Verified) */}
        <BncConnector
          id="vb-bnc-b"
          position={[0.40, 0.04, 0]}
          rotation={[0, 0, 0]}
          isHovered={isH('vb-bnc-b')}
          isSelected={isS('vb-bnc-b')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />

        {/* Retaining Screws */}
        <ScrewMesh position={[-0.76, -0.26, 0.02]} rotation={[Math.PI / 2, 0, 0]} radius={0.05} />
        <ScrewMesh position={[0.76, -0.26, 0.02]} rotation={[Math.PI / 2, 0, 0]} radius={0.05} />
      </group>

      {/* ============================================================== */}
      {/* 7. MIO-GE-RJ45-IP ETHERNET MODULE (LOWER-RIGHT MODULAR BAY)    */}
      {/* ============================================================== */}
      <group position={[3.37, -0.80, halfD + 0.01]}>
        {/* Silver Faceplate */}
        <mesh
          position={[0, 0, 0]}
          onClick={(e) => { e.stopPropagation(); onSelect('ge-plate'); }}
          onPointerOver={(e) => { e.stopPropagation(); onHover('ge-plate', e); }}
          onPointerOut={(e) => { e.stopPropagation(); onUnhover('ge-plate'); }}
        >
          <planeGeometry args={[1.76, 0.68]} />
          <meshStandardMaterial
            map={textures.gePlate}
            metalness={0.92}
            roughness={0.25}
            wireframe={wireframe}
            emissive={isS('ge-plate') ? '#594400' : isH('ge-plate') ? '#2e2300' : '#000000'}
            emissiveIntensity={isS('ge-plate') ? 0.35 : isH('ge-plate') ? 0.15 : 0}
          />
        </mesh>

        {/* ACT Status LED Indicator (Photo 1 Verified) */}
        <LedIndicator
          id="ge-act-led"
          position={[-0.52, 0.16, 0.01]}
          color="#f59e0b"
          isHovered={isH('ge-act-led')}
          isSelected={isS('ge-act-led')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />

        {/* LINK Status LED Indicator (Photo 1 Verified) */}
        <LedIndicator
          id="ge-link-led"
          position={[0.08, 0.16, 0.01]}
          color="#22c55e"
          isHovered={isH('ge-link-led')}
          isSelected={isS('ge-link-led')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />

        {/* Gigabit Ethernet RJ45 Port (Photo 1 Verified) */}
        <Rj45Port
          id="ge-rj45"
          position={[0.08, -0.10, 0]}
          isHovered={isH('ge-rj45')}
          isSelected={isS('ge-rj45')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />

        {/* Corner Retaining Screws */}
        <ScrewMesh position={[-0.76, 0.24, 0.02]} rotation={[Math.PI / 2, 0, 0]} radius={0.05} />
        <ScrewMesh position={[0.76, -0.26, 0.02]} rotation={[Math.PI / 2, 0, 0]} radius={0.05} />
      </group>

      {/* ============================================================== */}
      {/* 8. REAR PANEL (UNVERIFIED PHYSICAL CONNECTOR ARRANGEMENT)      */}
      {/* ============================================================== */}
      <group position={[0, chassisCenterY, -halfD - 0.005]}>
        {/* Rear Faceplate with Unverified Layout Notice */}
        <mesh rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[chassisWidth, chassisBodyHeight]} />
          <meshStandardMaterial
            map={textures.rearFascia}
            metalness={0.8}
            roughness={0.35}
            wireframe={wireframe}
          />
        </mesh>

        {/* SFP Trunk Port 1 (Unverified Placement - 4 SFP Documented) */}
        <SfpCage
          id="net-port-1"
          position={[-2.85, -0.06, 0]}
          isHovered={isH('net-port-1')}
          isSelected={isS('net-port-1')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />

        {/* SFP Trunk Port 2 (Unverified Placement - 4 SFP Documented) */}
        <SfpCage
          id="net-port-2"
          position={[-1.65, -0.06, 0]}
          isHovered={isH('net-port-2')}
          isSelected={isS('net-port-2')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />

        {/* SFP Port 3 (Unverified Placement - 4 SFP Documented) */}
        <SfpCage
          id="net-sfp-3"
          position={[-0.45, -0.06, 0]}
          isHovered={isH('net-sfp-3')}
          isSelected={isS('net-sfp-3')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />

        {/* SFP Port 4 (Unverified Placement - 4 SFP Documented) */}
        <SfpCage
          id="net-sfp-4"
          position={[0.75, -0.06, 0]}
          isHovered={isH('net-sfp-4')}
          isSelected={isS('net-sfp-4')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />

        {/* Micro-USB COM Console Port (Unverified Hardware) */}
        <MicroUsbPort
          id="mgmt-com"
          position={[1.65, -0.10, 0]}
          isHovered={isH('mgmt-com')}
          isSelected={isS('mgmt-com')}
          onHover={onHover}
          onUnhover={onUnhover}
          onSelect={onSelect}
        />

        {/* Management Ethernet Port (Unverified Hardware) */}
        <group position={[2.65, -0.06, -0.10]} rotation={[0, Math.PI, 0]}>
          <Rj45Port
            id="mgmt-eth"
            position={[0, 0, 0]}
            isHovered={isH('mgmt-eth')}
            isSelected={isS('mgmt-eth')}
            onHover={onHover}
            onUnhover={onUnhover}
            onSelect={onSelect}
          />
        </group>
      </group>
    </group>
  );
}
