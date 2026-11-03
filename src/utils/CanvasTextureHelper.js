import * as THREE from 'three';

/**
 * Creates high-resolution canvas textures for realistic photorealistic markings,
 * logos, silkscreens, and brushed metal finishes matching the reference photographs.
 * 
 * Calibrated for SCORPION-4 official chassis dimensions: 8.5" W × 2.5" H × 6.0" D
 */

// Draw an accurate scorpion silhouette
function drawScorpionSilhouette(ctx, cx, cy, radius, color = '#000000') {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = radius * 0.12;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Body / Abdomen (segmented oval)
  ctx.beginPath();
  ctx.ellipse(0, radius * 0.1, radius * 0.28, radius * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head / Prosoma
  ctx.beginPath();
  ctx.ellipse(0, -radius * 0.25, radius * 0.22, radius * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail (curving upward and arching forward with stinger)
  ctx.beginPath();
  ctx.moveTo(0, radius * 0.5);
  ctx.bezierCurveTo(
    radius * 0.35, radius * 0.75,
    radius * 0.65, radius * 0.35,
    radius * 0.45, -radius * 0.4
  );
  ctx.bezierCurveTo(
    radius * 0.35, -radius * 0.7,
    -radius * 0.05, -radius * 0.75,
    -radius * 0.25, -radius * 0.55
  );
  ctx.stroke();

  // Stinger barb
  ctx.beginPath();
  ctx.moveTo(-radius * 0.25, -radius * 0.55);
  ctx.lineTo(-radius * 0.4, -radius * 0.45);
  ctx.lineTo(-radius * 0.25, -radius * 0.42);
  ctx.fill();

  // Left Pincer (Pedipalp)
  ctx.beginPath();
  ctx.moveTo(-radius * 0.15, -radius * 0.35);
  ctx.quadraticCurveTo(-radius * 0.6, -radius * 0.45, -radius * 0.5, -radius * 0.7);
  ctx.stroke();
  // Claw left
  ctx.beginPath();
  ctx.arc(-radius * 0.52, -radius * 0.72, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Right Pincer (Pedipalp)
  ctx.beginPath();
  ctx.moveTo(radius * 0.15, -radius * 0.35);
  ctx.quadraticCurveTo(radius * 0.6, -radius * 0.45, radius * 0.5, -radius * 0.7);
  ctx.stroke();
  // Claw right
  ctx.beginPath();
  ctx.arc(radius * 0.52, -radius * 0.72, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Legs (3 pairs visible)
  const legPairs = [
    [-0.2, 0.0, 0.2, 0.0],
    [-0.22, 0.18, 0.22, 0.18],
    [-0.2, 0.34, 0.2, 0.34]
  ];

  ctx.lineWidth = radius * 0.07;
  legPairs.forEach(([lx, ly, rx, ry], i) => {
    // Left leg
    ctx.beginPath();
    ctx.moveTo(lx * radius, ly * radius);
    ctx.quadraticCurveTo((-0.6 - i * 0.1) * radius, (ly - 0.1) * radius, (-0.7 - i * 0.08) * radius, (ly + 0.25) * radius);
    ctx.stroke();

    // Right leg
    ctx.beginPath();
    ctx.moveTo(rx * radius, ry * radius);
    ctx.quadraticCurveTo((0.6 + i * 0.1) * radius, (ry - 0.1) * radius, (0.7 + i * 0.08) * radius, (ry + 0.25) * radius);
    ctx.stroke();
  });

  ctx.restore();
}

// Draw the signature yellow Evertz brand logo
function drawEvertzLogo(ctx, x, y, height) {
  ctx.save();
  ctx.translate(x, y);

  // Evertz signature yellow: bold, modern, slightly italicized lower-case
  ctx.fillStyle = '#FED100';
  ctx.font = `italic 900 ${height}px "Helvetica Neue", "Arial Black", Arial, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('evertz', 0, 0);

  ctx.restore();
}

// Complete precise SCORPION-4 drawer
function drawScorpionLogoCorrect(ctx, x, y, fontSize) {
  ctx.save();
  ctx.translate(x, y);

  ctx.font = `900 ${fontSize}px "Helvetica Neue", "Arial Black", Arial, sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  const track = fontSize * 0.16;
  let cx = 0;

  // S C O R P I
  const p1 = ['S', 'C', 'O', 'R', 'P', 'I'];
  p1.forEach((ch) => {
    ctx.fillText(ch, cx, 0);
    cx += ctx.measureText(ch).width + track;
  });

  // Yellow Scorpion Circle Badge for the second 'O'
  const radius = fontSize * 0.52;
  const badgeX = cx + radius;
  const badgeY = -1;

  ctx.beginPath();
  ctx.arc(badgeX, badgeY, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#FED100';
  ctx.fill();

  // Draw scorpion inside circle
  drawScorpionSilhouette(ctx, badgeX, badgeY, radius * 0.8, '#10141d');

  ctx.fillStyle = '#FFFFFF';
  cx += radius * 2 + track;

  // N - 4
  const p2 = ['N', '-', '4'];
  p2.forEach((ch) => {
    ctx.fillText(ch, cx, 0);
    cx += ctx.measureText(ch).width + track;
  });

  ctx.restore();
}

/**
 * Creates texture for the Front Chassis Face (Left portion of Front Panel)
 * Calibrated to width 4.7" × height 1.6"
 */
export function createFrontFasciaTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Matte black powder-coated aluminum background (#171717)
  ctx.fillStyle = '#171717';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fine brushed / bead-blasted metal noise
  for (let i = 0; i < 12000; i++) {
    const nx = Math.random() * canvas.width;
    const ny = Math.random() * canvas.height;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.12)';
    ctx.fillRect(nx, ny, 1.5, 1.5);
  }

  // Top Left: Signature Yellow evertz logo
  drawEvertzLogo(ctx, 120, 190, 78);

  // Power section markings:
  // Numbers '1' and '2' above the 12VDC connectors
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 40px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';

  // Port 1 center is approx X = 760
  ctx.fillText('1', 760, 240);
  // LED 1 is at X = 960
  ctx.font = '26px "Helvetica Neue", Arial, sans-serif';
  ctx.fillText('1', 960, 340);

  // Port 2 center is approx X = 1220
  ctx.font = 'bold 40px "Helvetica Neue", Arial, sans-serif';
  ctx.fillText('2', 1220, 240);
  // LED 2 is at X = 1420
  ctx.font = '26px "Helvetica Neue", Arial, sans-serif';
  ctx.fillText('2', 1420, 340);

  // Bracket and "12VDC" underneath Power 1 and 2
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.beginPath();
  // Left bracket arm
  ctx.moveTo(700, 520);
  ctx.lineTo(700, 545);
  ctx.lineTo(890, 545);
  // Right bracket arm
  ctx.moveTo(1280, 520);
  ctx.lineTo(1280, 545);
  ctx.lineTo(1090, 545);
  ctx.stroke();

  ctx.font = 'bold 30px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('12VDC', 990, 550);

  // REF IN markings (bulkhead center at X = 1780)
  ctx.font = 'bold 34px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('REF IN', 1780, 610);

  // Large SCORPION-4 Branding along bottom
  drawScorpionLogoCorrect(ctx, 100, 810, 84);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Creates brushed aluminum texture for MIO-BLADE-Z21 module faceplate (#A6A6A3)
 * Calibrated to width 3.65" × height 0.68"
 */
export function createBladePlateTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Base brushed silver/aluminum with calibrated #A6A6A3 tone
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, '#9c9c99');
  gradient.addColorStop(0.25, '#b4b4b0');
  gradient.addColorStop(0.65, '#a6a6a3');
  gradient.addColorStop(1, '#9a9a97');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fine horizontal brushed grain lines
  ctx.lineWidth = 1;
  for (let y = 0; y < canvas.height; y += 2) {
    const alpha = 0.04 + Math.random() * 0.07;
    ctx.strokeStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Plate borders and chamfer lines
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Top Title: "MIO-BLADE-Z21"
  ctx.fillStyle = '#181a1d';
  ctx.font = '900 48px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MIO-BLADE-Z21', canvas.width / 2, 70);

  // Upper ventilation punch holes matrix (circular cutouts in silver plate matching Photo 1)
  ctx.fillStyle = '#131518';
  const ventRadius = 24;
  const ventRows = [
    { y: 135, cols: [330, 490, 650, 810, 970, 1130, 1290, 1450, 1610] },
    { y: 195, cols: [410, 570, 730, 890, 1050, 1210, 1370, 1530] }
  ];

  ventRows.forEach(row => {
    row.cols.forEach(vx => {
      ctx.beginPath();
      ctx.arc(vx, row.y, ventRadius, 0, Math.PI * 2);
      ctx.fill();
      // Hole bevel / rim highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  });

  // "SDI OUT" header and port indices (4, 3, 2, 1)
  ctx.fillStyle = '#181a1d';
  ctx.font = 'bold 36px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SDI OUT', 520, 285);

  ctx.font = 'bold 30px "Helvetica Neue", Arial, sans-serif';
  const outPorts = [
    { x: 250, label: '4' },
    { x: 430, label: '3' },
    { x: 610, label: '2' },
    { x: 790, label: '1' }
  ];
  outPorts.forEach(p => {
    ctx.fillText(p.label, p.x, 340);
  });

  // "SDI IN" header and port indices (4, 3, 2, 1)
  ctx.font = 'bold 36px "Helvetica Neue", Arial, sans-serif';
  ctx.fillText('SDI IN', 1450, 285);

  ctx.font = 'bold 30px "Helvetica Neue", Arial, sans-serif';
  const inPorts = [
    { x: 1180, label: '4' },
    { x: 1360, label: '3' },
    { x: 1540, label: '2' },
    { x: 1720, label: '1' }
  ];
  inPorts.forEach(p => {
    ctx.fillText(p.label, p.x, 340);
  });

  // Bottom edge connector clearance markers
  ctx.strokeStyle = 'rgba(0,0,0,0.22)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, 365);
  ctx.lineTo(880, 365);
  ctx.moveTo(1050, 365);
  ctx.lineTo(1850, 365);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Creates brushed aluminum texture for MIO-VB-2-12G module faceplate (#A6A6A3)
 * Calibrated to width 1.76" × height 0.68"
 */
export function createVbPlateTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Base brushed silver/aluminum #A6A6A3
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, '#9c9c99');
  gradient.addColorStop(0.5, '#b4b4b0');
  gradient.addColorStop(1, '#9a9a97');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Brushed grain
  for (let y = 0; y < canvas.height; y += 2) {
    const alpha = 0.04 + Math.random() * 0.07;
    ctx.strokeStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Bevel borders
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Port labels "A" and "B" matching Photo 1
  ctx.fillStyle = '#181a1d';
  ctx.font = '900 52px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A', 330, 560);
  ctx.fillText('B', 770, 560);

  // Bottom module designation: "MIO-VB-2-12G"
  ctx.font = 'bold 44px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('MIO-VB-2-12G', 50, 715);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Creates brushed aluminum texture for MIO-GE-RJ45-IP module faceplate (#A6A6A3)
 * Calibrated to width 1.76" × height 0.68"
 */
export function createGePlateTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Base brushed silver/aluminum #A6A6A3
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, '#9c9c99');
  gradient.addColorStop(0.5, '#b4b4b0');
  gradient.addColorStop(1, '#9a9a97');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grain
  for (let y = 0; y < canvas.height; y += 2) {
    const alpha = 0.04 + Math.random() * 0.07;
    ctx.strokeStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Border
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Top title: "MIO-GE-RJ45-IP" matching Photo 1
  ctx.fillStyle = '#181a1d';
  ctx.font = '900 46px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('MIO-GE-RJ45-IP', canvas.width - 60, 75);

  // LED labels: "ACT" and "LINK"
  ctx.font = 'bold 38px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ACT', 280, 160);
  ctx.fillText('LINK', 620, 160);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Creates texture for Rear Panel (Trunk / WAN & Management face) (#171717)
 * Calibrated for width 8.5" × height 1.6"
 */
export function createRearFasciaTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Matte black powder-coated aluminum (#171717)
  ctx.fillStyle = '#171717';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle metal noise
  for (let i = 0; i < 12000; i++) {
    const nx = Math.random() * canvas.width;
    const ny = Math.random() * canvas.height;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.12)';
    ctx.fillRect(nx, ny, 1.5, 1.5);
  }

  // Top Right: Signature Yellow evertz logo
  drawEvertzLogo(ctx, 1640, 180, 72);

  // Technical Audit Banner: Mark rear layout as unverified
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 28px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('[ REAR HARDWARE ARRANGEMENT: UNVERIFIED BY PHOTOS ]', 120, 180);

  // Generic SFP Port Markers (Documented: 4 SFP ports; exact labels & placement unverified)
  ctx.fillStyle = '#D1D5DB';
  ctx.font = 'bold 30px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SFP 1', 330, 240);
  ctx.fillText('SFP 2', 620, 240);
  ctx.fillText('SFP 3', 910, 240);
  ctx.fillText('SFP 4', 1200, 240);

  // Micro-USB & Management area marked UNVERIFIED
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '22px "Helvetica Neue", Arial, sans-serif';
  ctx.fillText('[UNVERIFIED]', 1430, 240);
  ctx.fillText('[UNVERIFIED]', 1720, 240);

  // Bottom Center/Left: SCORPION-4 branding
  drawScorpionLogoCorrect(ctx, 350, 810, 84);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Creates texture for Heatsink Top (featuring central laser-etched circular Scorpion graphic)
 * Calibrated for heatsink width 8.1" × depth 5.6"
 */
export function createHeatsinkTopTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Dark graphite anodized surface
  ctx.fillStyle = '#26282d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Large laser-etched circular scorpion medallion in center
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 250;

  // Etched circular ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle circular hatched lines matching CNC milling / laser etching
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  for (let r = 30; r < radius - 15; r += 16) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Laser-etched Scorpion graphic
  drawScorpionSilhouette(ctx, centerX, centerY, radius * 0.72, 'rgba(255, 255, 255, 0.26)');

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Creates side ventilation perforation texture (Matching #303236 dark graphite chassis)
 * Calibrated for side panel width 5.4" × height 1.2"
 */
export function createSideVentTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Dark graphite chassis side plate (#303236)
  ctx.fillStyle = '#303236';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Ventilation punch hole matrix (3 rows × 28 columns matching Photo 3)
  const rows = 3;
  const cols = 28;
  const spacingX = 30;
  const spacingY = 40;
  const startX = 105;
  const startY = 85;
  const holeRadius = 10;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const hx = startX + c * spacingX;
      const hy = startY + r * spacingY;

      // Dark interior cavity of hole
      ctx.beginPath();
      ctx.arc(hx, hy, holeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#141517';
      ctx.fill();

      // Top-left rim highlight
      ctx.beginPath();
      ctx.arc(hx, hy, holeRadius, Math.PI * 0.8, Math.PI * 1.8);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
