import React from 'react';
import type { MapTemplate, ElementType } from '../../../types';
import './MapTemplates.css';

interface MapTemplatesProps {
  onTemplateSelect: (type: ElementType) => void;
  selectedTemplate: ElementType | null;
}

const TEMPLATES: MapTemplate[] = [
  {
    id: 'room',
    name: '部屋',
    type: 'room',
    icon: '🏠',
    defaultProperties: { name: '部屋', width: 100, height: 100, color: '#e3f2fd' }
  },
  {
    id: 'corridor',
    name: '廊下',
    type: 'corridor',
    icon: '🚶',
    defaultProperties: { name: '廊下', width: 40, height: 100, color: '#f3e5f5' }
  },
  {
    id: 'stairs',
    name: '階段',
    type: 'stairs',
    icon: '🪜',
    defaultProperties: { name: '階段', width: 60, height: 80, color: '#fff3e0' }
  },
  {
    id: 'elevator',
    name: 'エレベーター',
    type: 'elevator',
    icon: '🛗',
    defaultProperties: { name: 'エレベーター', width: 60, height: 60, color: '#e8f5e8' }
  },
  {
    id: 'door',
    name: 'ドア',
    type: 'door',
    icon: '🚪',
    defaultProperties: { name: 'ドア', width: 20, height: 40, color: '#fce4ec' }
  },
  {
    id: 'wall',
    name: '壁',
    type: 'wall',
    icon: '🧱',
    defaultProperties: { name: '壁', width: 20, height: 100, color: '#f5f5f5' }
  }
];

const MapTemplates: React.FC<MapTemplatesProps> = ({ onTemplateSelect, selectedTemplate }) => {
  return (
    <div className="map-templates">
      <h3>テンプレート</h3>
      <div className="template-grid">
        {TEMPLATES.map(template => (
          <button
            key={template.id}
            className={`template-button ${selectedTemplate === template.type ? 'selected' : ''}`}
            onClick={() => onTemplateSelect(template.type)}
            title={template.name}
          >
            <span className="template-icon">{template.icon}</span>
            <span className="template-name">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MapTemplates;