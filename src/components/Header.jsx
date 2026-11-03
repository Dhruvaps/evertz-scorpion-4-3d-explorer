import { RotateCcw, Cpu, Activity, ShieldCheck, Image as ImageIcon } from 'lucide-react';

export default function Header({
  onResetView,
  onOpenReferences,
  activeView,
  onViewChange
}) {
  return (
    <header className="app-header">
      {/* Left: Brand & Model Title */}
      <div className="header-brand-group">
        <div className="evertz-brand-logo">
          <span className="brand-logo-text">evertz</span>
        </div>
        <div className="brand-divider"></div>
        <div className="header-titles">
          <div className="header-main-title">
            <span className="title-scorpion">SCORPION-4</span>
            <span className="title-tag">PORTABLE MINI FRAME</span>
          </div>
          <div className="header-sub-title">Interactive 3D Equipment & Component Explorer</div>
        </div>
      </div>

      {/* Center: Real-time Telemetry Status Badges */}
      <div className="header-telemetry-group">
        <div className="telemetry-badge status-green" title="Chassis Power Redundancy Status">
          <span className="status-indicator-dot"></span>
          <span className="telemetry-label">DUAL 12VDC</span>
          <span className="telemetry-val">OK</span>
        </div>

        <div className="telemetry-badge status-yellow" title="Genlock Sync Reference Lock">
          <Activity size={12} className="telemetry-icon" />
          <span className="telemetry-label">REF IN</span>
          <span className="telemetry-val">LOCKED</span>
        </div>

        <div className="telemetry-badge status-yellow" title="Compute Blade Microservice App Status">
          <Cpu size={12} className="telemetry-icon" />
          <span className="telemetry-label">MIO-BLADE-Z21</span>
          <span className="telemetry-val">ONLINE</span>
        </div>

        <div className="telemetry-badge status-dim">
          <ShieldCheck size={12} className="telemetry-icon" />
          <span className="telemetry-label">ENGINEERING TOOL</span>
        </div>
      </div>

      {/* Right: Quick Actions & Reference Modal Toggle */}
      <div className="header-actions-group">
        <button
          className="header-action-btn photo-ref-btn"
          onClick={onOpenReferences}
          title="View Original Reference Photographs"
        >
          <ImageIcon size={15} />
          <span>Photos</span>
        </button>

        <button
          className={`header-action-btn ${activeView === 'front' ? 'active-view' : ''}`}
          onClick={() => onViewChange('front')}
          title="Jump directly to Front MIO connectors"
        >
          <span>Front MIO</span>
        </button>

        <button
          className={`header-action-btn ${activeView === 'rear' ? 'active-view' : ''}`}
          onClick={() => onViewChange('rear')}
          title="Jump directly to Rear Trunk ports (Unverified physical arrangement)"
        >
          <span>Rear Trunk</span>
        </button>

        <button
          className="header-action-btn reset-btn"
          onClick={onResetView}
          title="Reset Camera to Default Angle"
        >
          <RotateCcw size={14} />
          <span>Reset View</span>
        </button>
      </div>
    </header>
  );
}
