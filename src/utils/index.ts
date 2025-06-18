// ユーティリティ関数

import type { Coordinates } from '../types';

/**
 * 2点間の距離を計算する
 */
export const calculateDistance = (point1: Coordinates, point2: Coordinates): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * 日付をフォーマットする
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * 文字列を切り詰める
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

/**
 * 施設タイプの色を取得する
 */
export const getFacilityTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    entrance: '#4CAF50',
    exit: '#F44336',
    elevator: '#2196F3',
    stairs: '#FF9800',
    restroom: '#9C27B0',
    restaurant: '#FF5722',
    shop: '#E91E63',
    office: '#607D8B',
    emergency_exit: '#D32F2F',
    information: '#00BCD4',
    other: '#9E9E9E',
  };
  return colorMap[type] || '#9E9E9E';
};