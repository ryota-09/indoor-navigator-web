import { useState, useCallback } from 'react';
import type { MapCanvas, MapElement, Tool, Coordinates, ElementType, ElementProperties } from '../types';

const INITIAL_CANVAS: MapCanvas = {
  elements: [],
  gridSize: 20,
  zoom: 1,
  offset: { x: 0, y: 0 }
};

export const useMapEditor = () => {
  const [canvas, setCanvas] = useState<MapCanvas>(INITIAL_CANVAS);
  const [selectedTool, setSelectedTool] = useState<Tool>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const addElement = useCallback((type: ElementType, position: Coordinates) => {
    const newElement: MapElement = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: {
        x: Math.round(position.x / canvas.gridSize) * canvas.gridSize,
        y: Math.round(position.y / canvas.gridSize) * canvas.gridSize
      },
      rotation: 0,
      properties: getDefaultProperties(type)
    };

    setCanvas(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
  }, [canvas.gridSize]);

  const updateElement = useCallback((id: string, updates: Partial<MapElement>) => {
    setCanvas(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      )
    }));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setCanvas(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id)
    }));
  }, []);

  const selectElement = useCallback((id: string | null) => {
    setCanvas(prev => ({
      ...prev,
      elements: prev.elements.map(el => ({
        ...el,
        selected: el.id === id
      }))
    }));
    setSelectedElementId(id);
  }, []);

  const moveElement = useCallback((id: string, position: Coordinates) => {
    const snappedPosition = {
      x: Math.round(position.x / canvas.gridSize) * canvas.gridSize,
      y: Math.round(position.y / canvas.gridSize) * canvas.gridSize
    };
    updateElement(id, { position: snappedPosition });
  }, [canvas.gridSize, updateElement]);

  const setZoom = useCallback((zoom: number) => {
    setCanvas(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(5, zoom))
    }));
  }, []);

  const setOffset = useCallback((offset: Coordinates) => {
    setCanvas(prev => ({
      ...prev,
      offset
    }));
  }, []);

  const exportMap = useCallback(() => {
    return JSON.stringify(canvas, null, 2);
  }, [canvas]);

  const importMap = useCallback((mapData: string) => {
    try {
      const parsed = JSON.parse(mapData);
      setCanvas(parsed);
    } catch (error) {
      console.error('Failed to import map:', error);
    }
  }, []);

  const clearCanvas = useCallback(() => {
    setCanvas(INITIAL_CANVAS);
    setSelectedElementId(null);
  }, []);

  return {
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
    importMap,
    clearCanvas
  };
};

function getDefaultProperties(type: ElementType): ElementProperties {
  switch (type) {
    case 'room':
      return { name: '部屋', width: 100, height: 100, color: '#e3f2fd' };
    case 'corridor':
      return { name: '廊下', width: 40, height: 100, color: '#f3e5f5' };
    case 'stairs':
      return { name: '階段', width: 60, height: 80, color: '#fff3e0' };
    case 'elevator':
      return { name: 'エレベーター', width: 60, height: 60, color: '#e8f5e8' };
    case 'door':
      return { name: 'ドア', width: 20, height: 40, color: '#fce4ec' };
    case 'wall':
      return { name: '壁', width: 20, height: 100, color: '#f5f5f5' };
    default:
      return { name: '要素', width: 50, height: 50, color: '#ffffff' };
  }
}