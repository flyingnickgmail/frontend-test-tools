// 线索相关类型
export interface Lead {
  id: string;
  customerId: string;
  customerName: string;
  customerType: 'VIP' | 'NORMAL';
  vehicleModel: string;
  accidentLocation: {
    address: string;
    coordinates: [number, number];
  };
  accidentType: 'MINOR' | 'MAJOR' | 'TOTAL_LOSS';
  reportTime: string;
  status: 'PENDING' | 'ALLOCATED' | 'PROCESSING' | 'COMPLETED';
  assignedStoreId?: string;
  priority: number;
  description?: string;
}

// 门店相关类型
export interface Store {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  serviceRadius: number;
  capacity: number;
  currentLoad: number;
  performanceScore: number;
  quota: {
    daily: number;
    monthly: number;
    completed: number;
  };
  contactInfo: {
    phone: string;
    manager: string;
  };
  type: 'DIRECT' | 'AUTHORIZED';
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}

// 分配模型相关类型
export interface AllocationModel {
  id: string;
  name: string;
  version: string;
  type: 'DISTANCE_PERFORMANCE' | 'QUOTA_BALANCE';
  parameters: {
    distanceWeight: number;
    performanceWeight: number;
    quotaWeight: number;
  };
  scope: {
    regions: string[];
    cities: string[];
  };
  status: 'DRAFT' | 'TESTING' | 'APPROVED' | 'ACTIVE' | 'DEPRECATED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  description?: string;
}

// 分配结果类型
export interface AllocationResult {
  leadId: string;
  storeId: string;
  score: number;
  factors: {
    distance: number;
    performance: number;
    quota: number;
  };
  reason: string;
  timestamp: string;
}

// 统计数据类型
export interface DashboardStats {
  totalLeads: number;
  allocatedLeads: number;
  completedLeads: number;
  allocationRate: number;
  averageProcessingTime: number;
  customerSatisfaction: number;
  storeLoadBalance: number;
}

// 门店绩效类型
export interface StorePerformance {
  storeId: string;
  storeName: string;
  leadsCount: number;
  completionRate: number;
  averageProcessingTime: number;
  customerSatisfaction: number;
  loadRate: number;
  ranking: number;
}

// 趋势数据类型
export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

// 地图标记类型
export interface MapMarker {
  id: string;
  type: 'LEAD' | 'STORE';
  coordinates: [number, number];
  data: Lead | Store;
  status?: string;
}

// 用户类型
export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'REGIONAL_MANAGER' | 'STORE_MANAGER' | 'OPERATOR';
  region?: string;
  permissions: string[];
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

// 分页类型
export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

// 筛选条件类型
export interface FilterConditions {
  dateRange?: [string, string];
  status?: string[];
  region?: string[];
  storeType?: string[];
  customerType?: string[];
}

// 图表配置类型
export interface ChartConfig {
  title: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'map';
  data: any[];
  options?: any;
}

// 通知类型
export interface Notification {
  id: string;
  type: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}