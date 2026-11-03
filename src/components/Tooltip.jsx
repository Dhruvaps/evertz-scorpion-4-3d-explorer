import { COMPONENTS_DATA } from '../data/components';

export default function Tooltip({ hoveredId, mousePos }) {
  if (!hoveredId || !COMPONENTS_DATA[hoveredId]) return null;

  const component = COMPONENTS_DATA[hoveredId];

  // Keep tooltip on screen
  const x = Math.min(mousePos.x + 18, window.innerWidth - 280);
  const y = Math.min(mousePos.y + 18, window.innerHeight - 120);

  return (
    <div
      className="floating-tooltip"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="tooltip-header">
        <span className="tooltip-badge">{component.module}</span>
        <span className="tooltip-type">{component.type}</span>
      </div>
      <div className="tooltip-title">{component.name}</div>
      <div className="tooltip-spec">{component.interface}</div>
      <div className="tooltip-action-hint">Click to inspect technical details</div>
    </div>
  );
}
