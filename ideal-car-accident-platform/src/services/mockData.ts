import { 
  DashboardStats, 
  TrendData, 
  StorePerformance, 
  Lead, 
  Store, 
  AllocationModel, 
  AllocationResult 
} from '../types'

// 模拟仪表盘数据
export const mockDashboardData = {
  async getDashboardData() {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      stats: {
        totalLeads: 1248,
        allocatedLeads: 1186,
        completedLeads: 1156,
        allocationRate: 95.0,
        averageProcessingTime: 28,
        customerSatisfaction: 4.7,
        storeLoadBalance: 87.6,
      } as DashboardStats,
      
      trendData: [
        { date: '2024-10-01', value: 45 },
        { date: '2024-10-02', value: 52 },
        { date: '2024-10-03', value: 38 },
        { date: '2024-10-04', value: 61 },
        { date: '2024-10-05', value: 48 },
        { date: '2024-10-06', value: 55 },
        { date: '2024-10-07', value: 42 },
        { date: '2024-10-08', value: 58 },
        { date: '2024-10-09', value: 49 },
        { date: '2024-10-10', value: 63 },
        { date: '2024-10-11', value: 47 },
        { date: '2024-10-12', value: 56 },
        { date: '2024-10-13', value: 41 },
        { date: '2024-10-14', value: 59 },
        { date: '2024-10-15', value: 52 },
      ] as TrendData[],
      
      storePerformance: [
        { storeId: '001', storeName: '杭州西湖店', leadsCount: 156, completionRate: 98.5, averageProcessingTime: 25, customerSatisfaction: 4.8, loadRate: 85, ranking: 1 },
        { storeId: '002', storeName: '杭州滨江店', leadsCount: 142, completionRate: 96.2, averageProcessingTime: 28, customerSatisfaction: 4.6, loadRate: 78, ranking: 2 },
        { storeId: '003', storeName: '杭州萧山店', leadsCount: 138, completionRate: 94.8, averageProcessingTime: 32, customerSatisfaction: 4.5, loadRate: 82, ranking: 3 },
        { storeId: '004', storeName: '杭州余杭店', leadsCount: 125, completionRate: 92.1, averageProcessingTime: 35, customerSatisfaction: 4.3, loadRate: 75, ranking: 4 },
        { storeId: '005', storeName: '杭州拱墅店', leadsCount: 118, completionRate: 89.7, averageProcessingTime: 38, customerSatisfaction: 4.2, loadRate: 88, ranking: 5 },
      ] as StorePerformance[],
    }
  },

  async getAnalyticsData(filters: any) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 根据筛选条件返回不同的数据
    return {
      stats: {
        totalLeads: filters.region === 'east' ? 856 : 1248,
        allocatedLeads: filters.region === 'east' ? 812 : 1186,
        completedLeads: filters.region === 'east' ? 798 : 1156,
        allocationRate: filters.region === 'east' ? 94.9 : 95.0,
        averageProcessingTime: filters.region === 'east' ? 26 : 28,
        customerSatisfaction: filters.region === 'east' ? 4.8 : 4.7,
        storeLoadBalance: filters.region === 'east' ? 89.2 : 87.6,
      } as DashboardStats,
      
      trendData: [
        { date: '2024-10-01', value: 45 },
        { date: '2024-10-02', value: 52 },
        { date: '2024-10-03', value: 38 },
        { date: '2024-10-04', value: 61 },
        { date: '2024-10-05', value: 48 },
        { date: '2024-10-06', value: 55 },
        { date: '2024-10-07', value: 42 },
        { date: '2024-10-08', value: 58 },
        { date: '2024-10-09', value: 49 },
        { date: '2024-10-10', value: 63 },
        { date: '2024-10-11', value: 47 },
        { date: '2024-10-12', value: 56 },
        { date: '2024-10-13', value: 41 },
        { date: '2024-10-14', value: 59 },
        { date: '2024-10-15', value: 52 },
      ] as TrendData[],
      
      storePerformance: [
        { storeId: '001', storeName: '杭州西湖店', leadsCount: 156, completionRate: 98.5, averageProcessingTime: 25, customerSatisfaction: 4.8, loadRate: 85, ranking: 1 },
        { storeId: '002', storeName: '杭州滨江店', leadsCount: 142, completionRate: 96.2, averageProcessingTime: 28, customerSatisfaction: 4.6, loadRate: 78, ranking: 2 },
        { storeId: '003', storeName: '杭州萧山店', leadsCount: 138, completionRate: 94.8, averageProcessingTime: 32, customerSatisfaction: 4.5, loadRate: 82, ranking: 3 },
        { storeId: '004', storeName: '杭州余杭店', leadsCount: 125, completionRate: 92.1, averageProcessingTime: 35, customerSatisfaction: 4.3, loadRate: 75, ranking: 4 },
        { storeId: '005', storeName: '杭州拱墅店', leadsCount: 118, completionRate: 89.7, averageProcessingTime: 38, customerSatisfaction: 4.2, loadRate: 88, ranking: 5 },
      ] as StorePerformance[],
    }
  },

  async getModels() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [
      {
        id: '1',
        name: '杭州地区-距离绩效平衡模型-V1',
        version: '1.0',
        type: 'DISTANCE_PERFORMANCE',
        parameters: {
          distanceWeight: 40,
          performanceWeight: 40,
          quotaWeight: 20,
        },
        scope: {
          regions: ['华东区域'],
          cities: ['杭州市'],
        },
        status: 'ACTIVE',
        createdAt: '2024-10-01T08:00:00Z',
        updatedAt: '2024-10-01T08:00:00Z',
        createdBy: 'admin',
        description: '适用于杭州地区的距离和绩效平衡模型',
      },
      {
        id: '2',
        name: '上海地区-配额平衡模型-V1',
        version: '1.0',
        type: 'QUOTA_BALANCE',
        parameters: {
          distanceWeight: 30,
          performanceWeight: 30,
          quotaWeight: 40,
        },
        scope: {
          regions: ['华东区域'],
          cities: ['上海市'],
        },
        status: 'APPROVED',
        createdAt: '2024-10-05T10:00:00Z',
        updatedAt: '2024-10-05T10:00:00Z',
        createdBy: 'admin',
        description: '适用于上海地区的配额平衡模型',
      },
      {
        id: '3',
        name: '北京地区-距离绩效平衡模型-V2',
        version: '2.0',
        type: 'DISTANCE_PERFORMANCE',
        parameters: {
          distanceWeight: 45,
          performanceWeight: 35,
          quotaWeight: 20,
        },
        scope: {
          regions: ['华北区域'],
          cities: ['北京市'],
        },
        status: 'TESTING',
        createdAt: '2024-10-10T14:00:00Z',
        updatedAt: '2024-10-10T14:00:00Z',
        createdBy: 'admin',
        description: '北京地区优化版本，提高距离权重',
      },
    ] as AllocationModel[]
  },

  async getStores() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [
      {
        id: '001',
        name: '杭州西湖店',
        address: '杭州市西湖区文三路553号',
        coordinates: [120.135, 30.259] as [number, number],
        serviceRadius: 5,
        capacity: 20,
        currentLoad: 17,
        performanceScore: 4.8,
        quota: {
          daily: 15,
          monthly: 450,
          completed: 420,
        },
        contactInfo: {
          phone: '0571-88888888',
          manager: '张经理',
        },
        type: 'DIRECT',
        status: 'ACTIVE',
      },
      {
        id: '002',
        name: '杭州滨江店',
        address: '杭州市滨江区江南大道123号',
        coordinates: [120.211, 30.189] as [number, number],
        serviceRadius: 5,
        capacity: 18,
        currentLoad: 14,
        performanceScore: 4.6,
        quota: {
          daily: 12,
          monthly: 360,
          completed: 340,
        },
        contactInfo: {
          phone: '0571-88888889',
          manager: '李经理',
        },
        type: 'DIRECT',
        status: 'ACTIVE',
      },
      {
        id: '003',
        name: '杭州萧山店',
        address: '杭州市萧山区市心北路456号',
        coordinates: [120.264, 30.185] as [number, number],
        serviceRadius: 5,
        capacity: 15,
        currentLoad: 12,
        performanceScore: 4.5,
        quota: {
          daily: 10,
          monthly: 300,
          completed: 285,
        },
        contactInfo: {
          phone: '0571-88888890',
          manager: '王经理',
        },
        type: 'AUTHORIZED',
        status: 'ACTIVE',
      },
      {
        id: '004',
        name: '杭州余杭店',
        address: '杭州市余杭区文一西路789号',
        coordinates: [120.018, 30.290] as [number, number],
        serviceRadius: 5,
        capacity: 12,
        currentLoad: 9,
        performanceScore: 4.3,
        quota: {
          daily: 8,
          monthly: 240,
          completed: 220,
        },
        contactInfo: {
          phone: '0571-88888891',
          manager: '赵经理',
        },
        type: 'AUTHORIZED',
        status: 'ACTIVE',
      },
      {
        id: '005',
        name: '杭州拱墅店',
        address: '杭州市拱墅区莫干山路321号',
        coordinates: [120.155, 30.320] as [number, number],
        serviceRadius: 5,
        capacity: 10,
        currentLoad: 8,
        performanceScore: 4.2,
        quota: {
          daily: 6,
          monthly: 180,
          completed: 165,
        },
        contactInfo: {
          phone: '0571-88888892',
          manager: '陈经理',
        },
        type: 'AUTHORIZED',
        status: 'MAINTENANCE',
      },
    ] as Store[]
  },

  async getAllocationData() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const leads = [
      {
        id: 'L001',
        customerId: 'C001',
        customerName: '张先生',
        customerType: 'VIP' as const,
        vehicleModel: '理想L9',
        accidentLocation: {
          address: '杭州市西湖区文三路553号',
          coordinates: [120.135, 30.259] as [number, number],
        },
        accidentType: 'MINOR' as const,
        reportTime: '2024-10-15T14:30:25Z',
        status: 'ALLOCATED' as const,
        assignedStoreId: '001',
        priority: 8,
        description: '轻微剐蹭，车辆可以正常行驶',
      },
      {
        id: 'L002',
        customerId: 'C002',
        customerName: '李女士',
        customerType: 'NORMAL' as const,
        vehicleModel: '理想L8',
        accidentLocation: {
          address: '杭州市滨江区江南大道123号',
          coordinates: [120.211, 30.189] as [number, number],
        },
        accidentType: 'MAJOR' as const,
        reportTime: '2024-10-15T15:15:10Z',
        status: 'PROCESSING' as const,
        assignedStoreId: '002',
        priority: 9,
        description: '严重碰撞，车辆无法行驶',
      },
      {
        id: 'L003',
        customerId: 'C003',
        customerName: '王先生',
        customerType: 'NORMAL' as const,
        vehicleModel: '理想L7',
        accidentLocation: {
          address: '杭州市萧山区市心北路456号',
          coordinates: [120.264, 30.185] as [number, number],
        },
        accidentType: 'MINOR' as const,
        reportTime: '2024-10-15T16:45:30Z',
        status: 'PENDING' as const,
        priority: 5,
        description: '轻微剐蹭，需要现场处理',
      },
      {
        id: 'L004',
        customerId: 'C004',
        customerName: '赵女士',
        customerType: 'VIP' as const,
        vehicleModel: '理想L9',
        accidentLocation: {
          address: '杭州市余杭区文一西路789号',
          coordinates: [120.018, 30.290] as [number, number],
        },
        accidentType: 'MINOR' as const,
        reportTime: '2024-10-15T17:20:15Z',
        status: 'COMPLETED' as const,
        assignedStoreId: '004',
        priority: 7,
        description: '轻微剐蹭，已处理完成',
      },
    ] as Lead[]

    const allocationResults = [
      {
        leadId: 'L001',
        storeId: '001',
        score: 87,
        factors: {
          distance: 85,
          performance: 90,
          quota: 88,
        },
        reason: '距离最近，绩效优秀，配额充足',
        timestamp: '2024-10-15T14:30:30Z',
      },
      {
        leadId: 'L002',
        storeId: '002',
        score: 82,
        factors: {
          distance: 80,
          performance: 85,
          quota: 82,
        },
        reason: '距离适中，绩效良好，配额充足',
        timestamp: '2024-10-15T15:15:15Z',
      },
    ] as AllocationResult[]

    return {
      leads,
      allocationResults,
    }
  },
}