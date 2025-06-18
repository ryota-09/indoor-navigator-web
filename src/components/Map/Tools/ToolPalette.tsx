import React from 'react';
import type { Tool } from '../../../types';
import './ToolPalette.css';

interface ToolPaletteProps {
  selectedTool: Tool;
  onToolSelect: (tool: Tool) => void;
}

const TOOLS = [
  { id: 'select' as Tool, name: '選択', icon: '👆', description: '要素を選択・移動' },
  { id: 'pan' as Tool, name: 'パン', icon: '✋', description: 'キャンバスを移動' },
  { id: 'template' as Tool, name: 'テンプレート', icon: '📐', description: '要素を配置' },
  { id: 'delete' as Tool, name: '削除', icon: '🗑️', description: '要素を削除' }
];

const ToolPalette: React.FC<ToolPaletteProps> = ({ selectedTool, onToolSelect }) => {
  return (
    <div className="tool-palette">
      <h3>ツール</h3>
      <div className="tool-buttons">
        {TOOLS.map(tool => (
          <button
            key={tool.id}
            className={`tool-button ${selectedTool === tool.id ? 'selected' : ''}`}
            onClick={() => onToolSelect(tool.id)}
            title={tool.description}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolPalette;