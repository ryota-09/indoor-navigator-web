import React, { useState, useEffect } from 'react';
import type { MapElement, ElementProperties } from '../../../types';
import './PropertiesPanel.css';

interface PropertiesPanelProps {
  selectedElement: MapElement | null;
  onElementUpdate: (id: string, updates: Partial<MapElement>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedElement, onElementUpdate }) => {
  const [properties, setProperties] = useState<ElementProperties>({});

  useEffect(() => {
    if (selectedElement) {
      setProperties(selectedElement.properties);
    } else {
      setProperties({});
    }
  }, [selectedElement]);

  const handlePropertyChange = (key: keyof ElementProperties, value: string | number) => {
    if (!selectedElement) return;

    const updatedProperties = { ...properties, [key]: value };
    setProperties(updatedProperties);
    onElementUpdate(selectedElement.id, { properties: updatedProperties });
  };

  const handleRotationChange = (rotation: number) => {
    if (!selectedElement) return;
    onElementUpdate(selectedElement.id, { rotation });
  };

  if (!selectedElement) {
    return (
      <div className="properties-panel">
        <h3>プロパティ</h3>
        <p className="no-selection">要素を選択してください</p>
      </div>
    );
  }

  return (
    <div className="properties-panel">
      <h3>プロパティ</h3>
      
      <div className="property-group">
        <label>名前</label>
        <input
          type="text"
          value={properties.name || ''}
          onChange={(e) => handlePropertyChange('name', e.target.value)}
          placeholder="要素名を入力"
        />
      </div>

      <div className="property-group">
        <label>幅</label>
        <input
          type="number"
          value={properties.width || 50}
          onChange={(e) => handlePropertyChange('width', parseInt(e.target.value) || 50)}
          min="10"
          max="500"
        />
      </div>

      <div className="property-group">
        <label>高さ</label>
        <input
          type="number"
          value={properties.height || 50}
          onChange={(e) => handlePropertyChange('height', parseInt(e.target.value) || 50)}
          min="10"
          max="500"
        />
      </div>

      <div className="property-group">
        <label>色</label>
        <input
          type="color"
          value={properties.color || '#ffffff'}
          onChange={(e) => handlePropertyChange('color', e.target.value)}
        />
      </div>

      <div className="property-group">
        <label>回転 ({selectedElement.rotation}°)</label>
        <input
          type="range"
          min="0"
          max="360"
          step="30"
          value={selectedElement.rotation}
          onChange={(e) => handleRotationChange(parseInt(e.target.value))}
        />
      </div>

      <div className="element-info">
        <p><strong>タイプ:</strong> {selectedElement.type}</p>
        <p><strong>位置:</strong> ({Math.round(selectedElement.position.x)}, {Math.round(selectedElement.position.y)})</p>
      </div>
    </div>
  );
};

export default PropertiesPanel;