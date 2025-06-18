// アプリケーション定数

export const FACILITY_TYPES = {
  ENTRANCE: 'entrance',
  EXIT: 'exit',
  ELEVATOR: 'elevator',
  STAIRS: 'stairs',
  RESTROOM: 'restroom',
  RESTAURANT: 'restaurant',
  SHOP: 'shop',
  OFFICE: 'office',
  EMERGENCY_EXIT: 'emergency_exit',
  INFORMATION: 'information',
  OTHER: 'other',
} as const;

export const FACILITY_TYPE_LABELS = {
  [FACILITY_TYPES.ENTRANCE]: '入口',
  [FACILITY_TYPES.EXIT]: '出口',
  [FACILITY_TYPES.ELEVATOR]: 'エレベーター',
  [FACILITY_TYPES.STAIRS]: '階段',
  [FACILITY_TYPES.RESTROOM]: 'トイレ',
  [FACILITY_TYPES.RESTAURANT]: 'レストラン',
  [FACILITY_TYPES.SHOP]: 'ショップ',
  [FACILITY_TYPES.OFFICE]: 'オフィス',
  [FACILITY_TYPES.EMERGENCY_EXIT]: '非常口',
  [FACILITY_TYPES.INFORMATION]: 'インフォメーション',
  [FACILITY_TYPES.OTHER]: 'その他',
} as const;

export const ROUTES = {
  HOME: '/',
  MAP_VIEWER: '/map-viewer',
  MAP_EDITOR: '/map-editor',
  SEARCH: '/search',
  AUTH: '/auth',
} as const;

export const API_ENDPOINTS = {
  USERS: '/api/users',
  MAPS: '/api/maps',
  FACILITIES: '/api/facilities',
  SEARCH: '/api/search',
} as const;