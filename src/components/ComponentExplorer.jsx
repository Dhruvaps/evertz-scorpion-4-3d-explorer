import { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Zap,
  Radio,
  Network,
  Cpu,
  Layers,
  Wrench,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { MODULE_CATEGORIES, COMPONENTS_DATA } from '../data/components';

// Helper to choose appropriate icon for component type
function getComponentIcon(type) {
  const t = type.toLowerCase();
  if (t.includes('power') || t.includes('dc')) return <Zap size={14} className="icon-power" />;
  if (t.includes('bnc') || t.includes('sdi') || t.includes('genlock') || t.includes('video')) return <Radio size={14} className="icon-bnc" />;
  if (t.includes('ethernet') || t.includes('rj45') || t.includes('wan') || t.includes('trunk')) return <Network size={14} className="icon-net" />;
  if (t.includes('compute') || t.includes('fpga') || t.includes('blade')) return <Cpu size={14} className="icon-cpu" />;
  if (t.includes('heatsink') || t.includes('chassis') || t.includes('enclosure')) return <Layers size={14} className="icon-chassis" />;
  return <Wrench size={14} className="icon-generic" />;
}

export default function ComponentExplorer({
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  onUnhover
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [collapsedCategories, setCollapsedCategories] = useState({});

  // Toggle category accordion collapse
  const toggleCategory = (catId) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Filter components
  const filteredComponents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const all = Object.values(COMPONENTS_DATA);

    return all.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.module.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.interface.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Group filtered components by category
  const groupedByCategory = useMemo(() => {
    const map = {};
    MODULE_CATEGORIES.forEach(cat => {
      map[cat.id] = [];
    });

    filteredComponents.forEach(comp => {
      if (map[comp.category]) {
        map[comp.category].push(comp);
      } else {
        if (!map.other) map.other = [];
        map.other.push(comp);
      }
    });

    return map;
  }, [filteredComponents]);

  return (
    <aside className="component-explorer-sidebar">
      {/* Sidebar Header */}
      <div className="explorer-header">
        <div className="explorer-title-row">
          <div className="explorer-title">
            <SlidersHorizontal size={15} />
            <span>Component Explorer</span>
          </div>
          <span className="explorer-count-badge">{filteredComponents.length} items</span>
        </div>

        {/* Search Bar */}
        <div className="explorer-search-box">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search ports, modules, BNCs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Quick Category Filter Pills */}
        <div className="category-filter-pills">
          <button
            className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          <button
            className={`filter-pill ${selectedCategory === 'blade-z21' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('blade-z21')}
          >
            MIO-BLADE
          </button>
          <button
            className={`filter-pill ${selectedCategory === 'vb-12g' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('vb-12g')}
          >
            MIO-VB (12G)
          </button>
          <button
            className={`filter-pill ${selectedCategory === 'ge-ip' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('ge-ip')}
          >
            MIO-GE (IP)
          </button>
          <button
            className={`filter-pill ${selectedCategory === 'chassis' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('chassis')}
          >
            Chassis & Pwr
          </button>
          <button
            className={`filter-pill ${selectedCategory === 'rear-trunk' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('rear-trunk')}
          >
            Rear (Unverified)
          </button>
        </div>
      </div>

      {/* Accordion List */}
      <div className="explorer-tree-content">
        {MODULE_CATEGORIES.map(category => {
          const items = groupedByCategory[category.id] || [];
          if (items.length === 0) return null;

          const isCollapsed = collapsedCategories[category.id];

          return (
            <div key={category.id} className="explorer-category-group">
              <button
                className="category-group-header"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="header-left">
                  {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                  <span className="category-name">{category.name}</span>
                </div>
                <span className="category-item-count">{items.length}</span>
              </button>

              {!isCollapsed && (
                <div className="category-item-list">
                  {items.map(comp => {
                    const isSelected = selectedId === comp.id;
                    const isHovered = hoveredId === comp.id;

                    return (
                      <div
                        key={comp.id}
                        className={`explorer-item ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                        onClick={() => onSelect(comp.id)}
                        onMouseEnter={(e) => onHover(comp.id, e)}
                        onMouseLeave={() => onUnhover(comp.id)}
                      >
                        <div className="item-icon-wrapper">
                          {getComponentIcon(comp.type)}
                        </div>
                        <div className="item-details">
                          <div className="item-name">{comp.name}</div>
                          <div className="item-sub">{comp.type}</div>
                        </div>
                        {isSelected && <span className="item-selected-dot"></span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredComponents.length === 0 && (
          <div className="explorer-empty-state">
            <p>No components match "{searchQuery}"</p>
            <button className="empty-reset-btn" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
              Reset Search Filter
            </button>
          </div>
        )}
      </div>

      {/* Explorer Footer Status */}
      <div className="explorer-footer">
        <div className="footer-status-row">
          <span className="footer-status-indicator"></span>
          <span className="footer-status-text">Raycasting Active • Hover & Click Enabled</span>
        </div>
      </div>
    </aside>
  );
}
