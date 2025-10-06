import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Select, DatePicker, Button, Typography } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { setStats, setTrendData, setStorePerformance } from '../store/slices/dashboardSlice'
import TrendChart from '../components/charts/TrendChart'
import StorePerformanceChart from '../components/charts/StorePerformanceChart'
import AllocationAnalysisChart from '../components/charts/AllocationAnalysisChart'
import { mockDashboardData } from '../services/mockData'

const { Title } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

const DataAnalytics: React.FC = () => {
  const dispatch = useDispatch()
  const { stats, trendData, storePerformance } = useSelector((state: RootState) => state.dashboard)
  const [dateRange, setDateRange] = useState<[string, string] | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAnalyticsData()
  }, [dateRange, selectedRegion])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      const data = await mockDashboardData.getAnalyticsData({
        dateRange,
        region: selectedRegion,
      })
      dispatch(setStats(data.stats))
      dispatch(setTrendData(data.trendData))
      dispatch(setStorePerformance(data.storePerformance))
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadAnalyticsData()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>数据分析</Title>
        <Button 
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={loading}
        >
          刷新数据
        </Button>
      </div>

      {/* 筛选条件 */}
      <Card className="custom-card" style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <span>时间范围：</span>
            <RangePicker 
              onChange={(dates) => {
                if (dates) {
                  setDateRange([
                    dates[0]?.format('YYYY-MM-DD') || '',
                    dates[1]?.format('YYYY-MM-DD') || ''
                  ])
                } else {
                  setDateRange(null)
                }
              }}
            />
          </Col>
          <Col>
            <span>区域：</span>
            <Select
              value={selectedRegion}
              onChange={setSelectedRegion}
              style={{ width: 200 }}
            >
              <Option value="all">全部区域</Option>
              <Option value="east">华东区域</Option>
              <Option value="north">华北区域</Option>
              <Option value="south">华南区域</Option>
              <Option value="west">华西区域</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 关键指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card primary">
            <div className="stat-value">{stats?.totalLeads || 0}</div>
            <div className="stat-label">总线索数</div>
            <div className="stat-change positive">+12.5%</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card success">
            <div className="stat-value">{stats?.allocationRate || 0}%</div>
            <div className="stat-label">分配成功率</div>
            <div className="stat-change positive">+3.2%</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card warning">
            <div className="stat-value">{stats?.averageProcessingTime || 0}</div>
            <div className="stat-label">平均处理时间(分钟)</div>
            <div className="stat-change negative">-8.5%</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card error">
            <div className="stat-value">{stats?.customerSatisfaction || 0}%</div>
            <div className="stat-label">客户满意度</div>
            <div className="stat-change positive">+5.1%</div>
          </Card>
        </Col>
      </Row>

      {/* 趋势分析 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="线索分配趋势" className="custom-card">
            <TrendChart data={trendData} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="门店绩效分析" className="custom-card">
            <StorePerformanceChart data={storePerformance} />
          </Card>
        </Col>
      </Row>

      {/* 分配分析 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="分配效果分析" className="custom-card">
            <AllocationAnalysisChart />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DataAnalytics