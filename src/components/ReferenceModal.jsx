import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

const REFERENCES = [
  {
    id: 'front-1',
    title: 'Reference 1: Front MIO Modular Face (Photo 1)',
    src: '/references/scorpion4-front-1.png',
    description: 'Front view showing dual 12VDC power jacks, REF IN genlock BNC, MIO-BLADE-Z21 microservice module with 8 observed SDI IN/OUT connectors, MIO-VB-2-12G video access module with dual BNCs, and MIO-GE-RJ45-IP module with Ethernet and LEDs.'
  },
  {
    id: 'front-2',
    title: 'Reference 2: Equipment Front Configuration 2 (Photo 2)',
    src: '/references/scorpion4-front-2.png',
    description: 'Second front-view equipment photograph. Note: Available reference images consist of two front views and one side view; rear hardware arrangement is not documented by these photographs.'
  },
  {
    id: 'side',
    title: 'Reference 3: Side Profile & Heatsink Extrusions (Photo 3)',
    src: '/references/scorpion4-side.png',
    description: 'Side view showing longitudinal heatsink fins running front-to-back, chassis side ventilation matrix, assembly hardware, and bottom mounting flange ears.'
  }
];

export default function ReferenceModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  const currentRef = REFERENCES[activeTab];

  return (
    <div className="reference-modal-overlay" onClick={onClose}>
      <div className="reference-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3>Original Equipment Reference Photographs</h3>
            <span className="modal-subtitle">Visual inspection benchmarks for geometry and connector fidelity</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="modal-tabs">
          {REFERENCES.map((item, idx) => (
            <button
              key={item.id}
              className={`modal-tab ${activeTab === idx ? 'active' : ''}`}
              onClick={() => setActiveTab(idx)}
            >
              <span>{item.id.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Image Preview */}
        <div className="modal-body">
          <div className="ref-image-wrapper">
            <img src={currentRef.src} alt={currentRef.title} className="ref-image" />
          </div>
          <div className="ref-meta">
            <h4>{currentRef.title}</h4>
            <p>{currentRef.description}</p>
            <div className="fidelity-badge">
              <CheckCircle2 size={14} />
              <span>Front & side geometry verified from photos; rear hardware arrangement is unverified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
