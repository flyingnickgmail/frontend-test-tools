import React, { useEffect } from 'react'
import { Row, Col, Card, Statistic, Typography } from 'antd'
import { 
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { setStats, setTrendData, setStorePerformance } from '../store/slices/dashboardSlice'
import TrendChart from '../components/charts/TrendChart'
import StorePerformanceChart from '../components/charts/StorePerformanceChart'
import MapVisualization from '../components/map/MapVisualization'
import { mockDashboardData } from '../services/mockData'

const { Title } = Typography

const Dashboard: React.FC = () => {
  const dispatch = useDispatch()
  const { stats, trendData, storePerformance } = useSelector((state: RootState) => state.dashboard)

  useEffect(() => {
    // 模拟数据加载
    const loadDashboardData = async () => {
      try {
        const data = await mockDashboardData.getDashboardData()
        dispatch(setStats(data.stats))
        dispatch(setTrendData(data.trendData))
        dispatch(setStorePerformance(data.storePerformance))
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      }
    }

    loadDashboardData()
  }, [dispatch])

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        仪表盘
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card primary">
            <Statistic
              title="总线索数"
              value={stats?.totalLeads || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#fff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card success">
            <Statistic
              title="已分配线索"
              value={stats?.allocatedLeads || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#fff' }}
              suffix={
                <span style={{ fontSize: '12px', opacity: 0.9 }}>
                  ({stats?.allocationRate || 0}%)
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card warning">
            <Statistic
              title="平均处理时间"
              value={stats?.averageProcessingTime || 0}
              prefix={<ClockCircleOutlined />}
              suffix="分钟"
              valueStyle={{ color: '#fff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card error">
            <Statistic
              title="客户满意度"
              value={stats?.customerSatisfaction || 0}
              prefix={<UserOutlined />}
              suffix="%"
              valueStyle={{ color: '#fff' }}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="线索分配趋势" className="custom-card">
            <TrendChart data={trendData} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="门店绩效排名" className="custom-card">
            <StorePerformanceChart data={storePerformance} />
          </Card>
        </Col>
      </Row>

      {/* 地图可视化 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="线索分配地图" className="custom-card">
            <MapVisualization />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard