import {
  CheckCircle2,
  AlertTriangle,
  Camera,
  FileText,
  HelpCircle,
  Link as LinkIcon,
  X,
  Crosshair,
  ArrowRight,
  Shield,
  Layers,
  Wrench
} from 'lucide-react';
import { COMPONENTS_DATA } from '../data/components';

export default function ComponentDetails({
  selectedId,
  onClose,
  onSelectComponent,
  onFocusView
}) {
  if (!selectedId || !COMPONENTS_DATA[selectedId]) {
    return (
      <aside className="component-details-sidebar empty-details">
        <div className="empty-details-content">
          <div className="empty-icon-wrap">
            <Crosshair size={32} />
          </div>
          <h3>No Component Selected</h3>
          <p>
            Hover and click any physical connector, module faceplate, or heatsink fin in the 3D viewer, or choose a component from the explorer tree.
          </p>
          <div className="quick-inspect-suggestions">
            <span className="suggestion-label">Popular components:</span>
            <button onClick={() => onSelectComponent('vb-bnc-a')}>MIO-VB 12G BNC A</button>
            <button onClick={() => onSelectComponent('blade-sdi-out-1')}>MIO-BLADE SDI OUT 1</button>
            <button onClick={() => onSelectComponent('ge-rj45')}>MIO-GE RJ45 Port</button>
            <button onClick={() => onSelectComponent('ref-in')}>REF IN Genlock</button>
            <button onClick={() => onSelectComponent('chassis-heatsink')}>Cooling Heatsink</button>
          </div>
        </div>
      </aside>
    );
  }

  const component = COMPONENTS_DATA[selectedId];

  // Determine appropriate camera view for this component
  const getSuggestedView = () => {
    if (component.category === 'rear-trunk') return 'rear';
    if (component.id === 'chassis-heatsink') return 'top';
    return 'front';
  };

  // Render audit status badge
  const renderAuditBadge = () => {
    if (component.auditStatus === 'verified') {
      return (
        <span className="verified-badge" title="Verified against official Evertz product specifications">
          <CheckCircle2 size={12} />
          <span>Verified Spec</span>
        </span>
      );
    }
    if (component.auditStatus === 'photo-derived') {
      return (
        <span className="photo-badge" title="Observed in front/side reference photographs">
          <Camera size={12} />
          <span>Photo Observation</span>
        </span>
      );
    }
    return (
      <span className="datasheet-req-badge" title="Parameters or rear physical arrangement unverified">
        <AlertTriangle size={12} />
        <span>Unverified / Requires Verification</span>
      </span>
    );
  };

  return (
    <aside className="component-details-sidebar">
      {/* Panel Header */}
      <div className="details-header">
        <div className="header-meta-row">
          <span className="module-tag">{component.module}</span>
          <div className="header-actions">
            {renderAuditBadge()}
            <button className="details-close-btn" onClick={onClose} title="Close panel">
              <X size={15} />
            </button>
          </div>
        </div>

        <h2 className="component-title">{component.name}</h2>
        <div className="component-id-chip">
          <code>ID: {component.id}</code>
        </div>
      </div>

      {/* Content Scroll Area */}
      <div className="details-scroll-content">
        {/* Quick Focus Button */}
        <div className="details-focus-action">
          <button
            className="focus-view-btn"
            onClick={() => onFocusView(getSuggestedView())}
          >
            <Crosshair size={14} />
            <span>Orient Camera to Component</span>
          </button>
        </div>

        {/* Technical Accuracy Audit Triad Card (Points 1, 2, 7) */}
        <div className="audit-triad-card">
          <div className="audit-triad-title">
            <Shield size={14} />
            <span>Technical Accuracy Audit</span>
          </div>

          {/* Tier 1: Documented Specifications */}
          <div className="audit-block audit-block-verified">
            <div className="audit-block-header">
              <CheckCircle2 size={13} className="audit-icon-verified" />
              <span className="audit-block-label">1. Documented Specifications</span>
            </div>
            {component.verifiedSpecs && component.verifiedSpecs.length > 0 ? (
              <ul className="audit-list">
                {component.verifiedSpecs.map((specItem, idx) => (
                  <li key={idx} className="audit-list-item verified-item">
                    <span className="audit-bullet">•</span>
                    <span>{specItem}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="audit-empty-note">No documented specification in official product literature.</div>
            )}
          </div>

          {/* Tier 2: Photograph-Derived Observations */}
          <div className="audit-block audit-block-photo">
            <div className="audit-block-header">
              <Camera size={13} className="audit-icon-photo" />
              <span className="audit-block-label">2. Photograph-Derived Observations</span>
            </div>
            {component.photoObservations && component.photoObservations.length > 0 ? (
              <ul className="audit-list">
                {component.photoObservations.map((obsItem, idx) => (
                  <li key={idx} className="audit-list-item photo-item">
                    <span className="audit-bullet">•</span>
                    <span>{obsItem}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="audit-empty-note">
                Unverified by photos: Available reference images consist of two front views and one side view; no rear photograph was supplied.
              </div>
            )}
          </div>

          {/* Tier 3: Information Requiring Verification */}
          <div className="audit-block audit-block-unverified">
            <div className="audit-block-header">
              <AlertTriangle size={13} className="audit-icon-unverified" />
              <span className="audit-block-label">3. Unverified / Requires Verification</span>
            </div>
            {component.verificationRequired && component.verificationRequired.length > 0 ? (
              <ul className="audit-list">
                {component.verificationRequired.map((reqItem, idx) => (
                  <li key={idx} className="audit-list-item unverified-item">
                    <span className="audit-bullet">•</span>
                    <span>{reqItem}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="audit-empty-note">All critical parameters verified.</div>
            )}
          </div>
        </div>

        {/* Technical Interface Card */}
        <div className="spec-card">
          <div className="spec-card-title">
            <FileText size={14} />
            <span>Interface Specification</span>
          </div>
          <div className="spec-grid">
            <div className="spec-row">
              <span className="spec-name">Type:</span>
              <span className="spec-val">{component.type}</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Interface:</span>
              <span className="spec-val">{component.interface}</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Standards:</span>
              <span className="spec-val">{component.spec}</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Module Slot:</span>
              <span className="spec-val">{component.module}</span>
            </div>
          </div>
        </div>

        {/* Operational Purpose */}
        <section className="details-section">
          <h4 className="section-heading">
            <Shield size={14} />
            <span>Primary Operational Purpose</span>
          </h4>
          <p className="section-body">{component.purpose}</p>
        </section>

        {/* In-Depth Technical Architecture */}
        <section className="details-section">
          <h4 className="section-heading">
            <Layers size={14} />
            <span>Technical Architecture & Function</span>
          </h4>
          <p className="section-body">{component.technicalExplanation}</p>
        </section>

        {/* Troubleshooting & Field Diagnostics */}
        {component.troubleshooting && component.troubleshooting.length > 0 && (
          <section className="details-section">
            <h4 className="section-heading">
              <Wrench size={14} />
              <span>Troubleshooting & Field Checks</span>
            </h4>
            <ul className="troubleshooting-list">
              {component.troubleshooting.map((step, idx) => (
                <li key={idx} className="troubleshooting-step">
                  <span className="step-number">{idx + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related Signal Path Components */}
        {component.relatedComponents && component.relatedComponents.length > 0 && (
          <section className="details-section">
            <h4 className="section-heading">
              <LinkIcon size={14} />
              <span>Related Signal Path Components</span>
            </h4>
            <div className="related-components-grid">
              {component.relatedComponents.map((relId) => {
                const rel = COMPONENTS_DATA[relId];
                if (!rel) return null;
                return (
                  <button
                    key={relId}
                    className="related-item-card"
                    onClick={() => onSelectComponent(relId)}
                  >
                    <div className="rel-left">
                      <span className="rel-name">{rel.name}</span>
                      <span className="rel-module">{rel.module}</span>
                    </div>
                    <ArrowRight size={13} className="rel-arrow" />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Engineering Caution / Standards Notice */}
        <div className="datasheet-notice-box">
          <div className="notice-icon">
            <HelpCircle size={15} />
          </div>
          <div className="notice-content">
            <span className="notice-title">Technical Audit Standard</span>
            <span className="notice-text">
              Distinctions reflect official Evertz SCORPION-4 product documentation and the three reference photos (two front views and one side view). Rear connector arrangement and unverified physical specifications require official manufacturer documentation before field servicing.
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
