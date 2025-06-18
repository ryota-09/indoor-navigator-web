import React, { useRef, useCallback, useState } from 'react';
import type { MouseEvent, TouchEvent } from 'react';
import type { MapCanvas as MapCanvasType, MapElement, Coordinates } from '../../../types';

interface MapCanvasProps {
  canvas: MapCanvasType;
  onElementClick: (element: MapElement) => void;
  onElementMove: (id: string, position: Coordinates) => void;
  onCanvasClick: (position: Coordinates) => void;
  onZoomChange: (zoom: number) => void;
  onOffsetChange: (offset: Coordinates) => void;
  selectedElementId: string | null;
}

const MapCanvas: React.FC<MapCanvasProps> = ({
  canvas,
  onElementClick,
  onElementMove,
  onCanvasClick,
  onZoomChange,
  onOffsetChange,
  selectedElementId
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Coordinates>({ x: 0, y: 0 });
  const [dragElementId, setDragElementId] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
  const [longPressStarted, setLongPressStarted] = useState(false);

  const getRelativePosition = useCallback((clientX: number, clientY: number): Coordinates => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - canvas.offset.x) / canvas.zoom,
      y: (clientY - rect.top - canvas.offset.y) / canvas.zoom
    };
  }, [canvas.offset, canvas.zoom]);

  const handleMouseDown = useCallback((e: MouseEvent<SVGSVGElement>) => {
    const position = getRelativePosition(e.clientX, e.clientY);
    
    const clickedElement = canvas.elements.find(el => 
      position.x >= el.position.x && 
      position.x <= el.position.x + (el.properties.width || 50) &&
      position.y >= el.position.y && 
      position.y <= el.position.y + (el.properties.height || 50)
    );

    if (clickedElement) {
      onElementClick(clickedElement);
      setDragElementId(clickedElement.id);
      setDragStart({ x: position.x - clickedElement.position.x, y: position.y - clickedElement.position.y });
    } else {
      onCanvasClick(position);
    }
    
    setIsDragging(true);
  }, [canvas.elements, getRelativePosition, onElementClick, onCanvasClick]);

  const handleMouseMove = useCallback((e: MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;

    const position = getRelativePosition(e.clientX, e.clientY);

    if (dragElementId) {
      const newPosition = {
        x: position.x - dragStart.x,
        y: position.y - dragStart.y
      };
      onElementMove(dragElementId, newPosition);
    } else {
      const deltaX = e.movementX;
      const deltaY = e.movementY;
      onOffsetChange({
        x: canvas.offset.x + deltaX,
        y: canvas.offset.y + deltaY
      });
    }
  }, [isDragging, dragElementId, dragStart, getRelativePosition, onElementMove, onOffsetChange, canvas.offset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragElementId(null);
    setDragStart({ x: 0, y: 0 });
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setLongPressStarted(false);
  }, [longPressTimer]);

  const startLongPress = useCallback((position: Coordinates) => {
    const timer = setTimeout(() => {
      setLongPressStarted(true);
      onCanvasClick(position);
    }, 500); // 500ms for long press
    setLongPressTimer(timer);
  }, [onCanvasClick]);

  const handleTouchStart = useCallback((e: TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const position = getRelativePosition(touch.clientX, touch.clientY);
    
    const clickedElement = canvas.elements.find(el => 
      position.x >= el.position.x && 
      position.x <= el.position.x + (el.properties.width || 50) &&
      position.y >= el.position.y && 
      position.y <= el.position.y + (el.properties.height || 50)
    );

    if (clickedElement) {
      onElementClick(clickedElement);
      setDragElementId(clickedElement.id);
      setDragStart({ x: position.x - clickedElement.position.x, y: position.y - clickedElement.position.y });
    } else {
      startLongPress(position);
    }
    
    setIsDragging(true);
  }, [canvas.elements, getRelativePosition, onElementClick, startLongPress]);

  const handleTouchMove = useCallback((e: TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (!isDragging) return;

    // Cancel long press if user moves during touch
    if (longPressTimer && !longPressStarted) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    const touch = e.touches[0];
    const position = getRelativePosition(touch.clientX, touch.clientY);

    if (dragElementId) {
      const newPosition = {
        x: position.x - dragStart.x,
        y: position.y - dragStart.y
      };
      onElementMove(dragElementId, newPosition);
    }
  }, [isDragging, longPressTimer, longPressStarted, dragElementId, dragStart, getRelativePosition, onElementMove]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setDragElementId(null);
    setDragStart({ x: 0, y: 0 });
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setLongPressStarted(false);
  }, [longPressTimer]);

  const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    onZoomChange(canvas.zoom * zoomFactor);
  }, [canvas.zoom, onZoomChange]);

  const renderGrid = () => {
    const gridSize = canvas.gridSize * canvas.zoom;
    const width = 2000;
    const height = 2000;
    
    const lines = [];
    
    for (let x = 0; x <= width; x += gridSize) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="#e0e0e0"
          strokeWidth="0.5"
        />
      );
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#e0e0e0"
          strokeWidth="0.5"
        />
      );
    }
    
    return lines;
  };

  const renderElement = (element: MapElement) => {
    const isSelected = element.id === selectedElementId;
    const width = element.properties.width || 50;
    const height = element.properties.height || 50;
    
    return (
      <g key={element.id} transform={`rotate(${element.rotation} ${element.position.x + width/2} ${element.position.y + height/2})`}>
        <rect
          x={element.position.x}
          y={element.position.y}
          width={width}
          height={height}
          fill={element.properties.color || '#ffffff'}
          stroke={isSelected ? '#2196f3' : '#666666'}
          strokeWidth={isSelected ? 2 : 1}
          rx={element.type === 'room' ? 5 : 0}
        />
        {element.properties.name && (
          <text
            x={element.position.x + width / 2}
            y={element.position.y + height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="12"
            fill="#333333"
            pointerEvents="none"
          >
            {element.properties.name}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="map-canvas-container" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 2000 2000"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <g transform={`translate(${canvas.offset.x}, ${canvas.offset.y}) scale(${canvas.zoom})`}>
          {renderGrid()}
          {canvas.elements.map(renderElement)}
        </g>
      </svg>
    </div>
  );
};

export default MapCanvas;