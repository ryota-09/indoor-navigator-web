// 共通型定義

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Map {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  description?: string;
  mapId: string;
  coordinates: Coordinates;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coordinates {
  x: number;
  y: number;
}

export type FacilityType = 
  | 'entrance'
  | 'exit'
  | 'elevator'
  | 'stairs'
  | 'restroom'
  | 'restaurant'
  | 'shop'
  | 'office'
  | 'emergency_exit'
  | 'information'
  | 'other';

export interface Route {
  id: string;
  from: Coordinates;
  to: Coordinates;
  waypoints: Coordinates[];
  distance: number;
  estimatedTime: number;
}

export interface SearchResult {
  facility: Facility;
  map: Map;
  relevanceScore: number;
}