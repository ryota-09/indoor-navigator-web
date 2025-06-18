import React, { useState, useCallback } from 'react';
import { useMapEditor } from '../../hooks/useMapEditor';
import { MapCanvas, MapTemplates, ToolPalette, PropertiesPanel } from '../../components/Map';
import type { ElementType, Coordinates, MapElement } from '../../types';
import './MapEditor.css';

const MapEditor: React.FC = () => {
  const {
    canvas,
    selectedTool,
    selectedElementId,
    setSelectedTool,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    moveElement,
    setZoom,
    setOffset,
    exportMap,
    clearCanvas
  } = useMapEditor();

  const [selectedTemplate, setSelectedTemplate] = useState<ElementType | null>('room');

  const handleCanvasClick = useCallback((position: Coordinates) => {
    if (selectedTool === 'template' && selectedTemplate) {
      addElement(selectedTemplate, position);
    } else if (selectedTool === 'select') {
      selectElement(null);
    }
  }, [selectedTool, selectedTemplate, addElement, selectElement]);

  const handleElementClick = useCallback((element: MapElement) => {
    if (selectedTool === 'select') {
      selectElement(element.id);
    } else if (selectedTool === 'delete') {
      deleteElement(element.id);
    }
  }, [selectedTool, selectElement, deleteElement]);

  const handleTemplateSelect = useCallback((type: ElementType) => {
    setSelectedTemplate(type);
    setSelectedTool('template');
  }, [setSelectedTool]);

  const handleSave = useCallback(() => {
    const mapData = exportMap();
    const blob = new Blob([mapData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'map.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [exportMap]);

  const selectedElement = canvas.elements.find(el => el.id === selectedElementId) || null;

  return (
    <div className="map-editor">
      <div className="map-editor-header">
        <h1>マップエディター</h1>
        <div className="editor-actions">
          <button onClick={clearCanvas} className="action-button secondary">
            クリア
          </button>
          <button onClick={handleSave} className="action-button primary">
            保存
          </button>
        </div>
      </div>
      
      <div className="map-editor-content">
        <div className="sidebar">
          <ToolPalette 
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />
          <MapTemplates
            onTemplateSelect={handleTemplateSelect}
            selectedTemplate={selectedTemplate}
          />
          <PropertiesPanel
            selectedElement={selectedElement}
            onElementUpdate={updateElement}
          />
        </div>
        
        <div className="canvas-area">
          <MapCanvas
            canvas={canvas}
            onElementClick={handleElementClick}
            onElementMove={moveElement}
            onCanvasClick={handleCanvasClick}
            onZoomChange={setZoom}
            onOffsetChange={setOffset}
            selectedElementId={selectedElementId}
          />
        </div>
      </div>
    </div>
  );
};

export default MapEditor;