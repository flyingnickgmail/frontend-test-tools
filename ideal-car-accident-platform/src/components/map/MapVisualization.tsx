import React, { useEffect, useRef } from 'react'
import { Card, Row, Col, Statistic, Tag, Space } from 'antd'
import { EnvironmentOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons'

const MapVisualization: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  // const [mapInstance, setMapInstance] = useState<any>(null)
  // const [selectedMarker, setSelectedMarker] = useState<any>(null)

  useEffect(() => {
    // 模拟地图初始化
    const initMap = () => {
      if (mapRef.current) {
        // 这里应该集成真实的地图API（如高德地图、百度地图等）
        // 由于是demo，我们创建一个模拟的地图容器
        const mapContainer = mapRef.current
        mapContainer.innerHTML = `
          <div style="
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            font-weight: bold;
            position: relative;
            overflow: hidden;
          ">
            <div style="text-align: center;">
              <div style="font-size: 24px; margin-bottom: 16px;">🗺️ 地图可视化</div>
              <div style="font-size: 14px; opacity: 0.8;">
                理想汽车事故线索智能分配平台
              </div>
              <div style="font-size: 12px; opacity: 0.6; margin-top: 8px;">
                集成高德地图API | 实时显示线索和门店分布
              </div>
            </div>
            
            <!-- 模拟门店标记 -->
            <div style="
              position: absolute;
              top: 20%;
              left: 30%;
              width: 20px;
              height: 20px;
              background: #52c41a;
              border-radius: 50%;
              border: 3px solid white;
              cursor: pointer;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            " title="杭州西湖店"></div>
            
            <div style="
              position: absolute;
              top: 40%;
              right: 25%;
              width: 20px;
              height: 20px;
              background: #52c41a;
              border-radius: 50%;
              border: 3px solid white;
              cursor: pointer;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            " title="杭州滨江店"></div>
            
            <div style="
              position: absolute;
              bottom: 30%;
              left: 20%;
              width: 20px;
              height: 20px;
              background: #52c41a;
              border-radius: 50%;
              border: 3px solid white;
              cursor: pointer;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            " title="杭州萧山店"></div>
            
            <!-- 模拟线索标记 -->
            <div style="
              position: absolute;
              top: 25%;
              left: 35%;
              width: 12px;
              height: 12px;
              background: #1890ff;
              border-radius: 50%;
              border: 2px solid white;
              cursor: pointer;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            " title="线索 #001"></div>
            
            <div style="
              position: absolute;
              top: 45%;
              right: 30%;
              width: 12px;
              height: 12px;
              background: #1890ff;
              border-radius: 50%;
              border: 2px solid white;
              cursor: pointer;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            " title="线索 #002"></div>
            
            <div style="
              position: absolute;
              bottom: 35%;
              left: 25%;
              width: 12px;
              height: 12px;
              background: #1890ff;
              border-radius: 50%;
              border: 2px solid white;
              cursor: pointer;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            " title="线索 #003"></div>
            
            <!-- 模拟分配连线 -->
            <div style="
              position: absolute;
              top: 25%;
              left: 30%;
              width: 50px;
              height: 2px;
              background: #ff4d4f;
              transform: rotate(15deg);
              opacity: 0.7;
            "></div>
            
            <div style="
              position: absolute;
              top: 45%;
              right: 25%;
              width: 50px;
              height: 2px;
              background: #ff4d4f;
              transform: rotate(-15deg);
              opacity: 0.7;
            "></div>
          </div>
        `
      }
    }

    initMap()
  }, [])

  // 模拟地图数据
  const mapStats = {
    totalStores: 12,
    activeStores: 10,
    totalLeads: 156,
    allocatedLeads: 142,
    pendingLeads: 14,
  }

  const recentAllocations = [
    { id: '001', customer: '张先生', store: '杭州西湖店', distance: '3.5km', time: '2分钟前' },
    { id: '002', customer: '李女士', store: '杭州滨江店', distance: '5.2km', time: '5分钟前' },
    { id: '003', customer: '王先生', store: '杭州萧山店', distance: '7.8km', time: '8分钟前' },
  ]

  return (
    <div>
      {/* 地图容器 */}
      <div ref={mapRef} className="map-container" style={{ marginBottom: 16 }} />
      
      {/* 地图统计信息 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="总门店数"
              value={mapStats.totalStores}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="营业中"
              value={mapStats.activeStores}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="总线索数"
              value={mapStats.totalLeads}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="已分配"
              value={mapStats.allocatedLeads}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近分配记录 */}
      <Card title="最近分配记录" size="small" style={{ marginTop: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {recentAllocations.map((allocation) => (
            <div key={allocation.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>
                  <EnvironmentOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  线索 #{allocation.id}
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  {allocation.customer} → {allocation.store}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  距离: {allocation.distance}
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  {allocation.time}
                </div>
              </div>
            </div>
          ))}
        </Space>
      </Card>

      {/* 图例说明 */}
      <Card title="图例说明" size="small" style={{ marginTop: 16 }}>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Space>
              <div style={{
                width: 16,
                height: 16,
                background: '#52c41a',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
              <span>门店位置</span>
            </Space>
          </Col>
          <Col span={12}>
            <Space>
              <div style={{
                width: 12,
                height: 12,
                background: '#1890ff',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
              <span>线索位置</span>
            </Space>
          </Col>
          <Col span={12}>
            <Space>
              <div style={{
                width: 20,
                height: 2,
                background: '#ff4d4f',
                opacity: 0.7
              }} />
              <span>分配连线</span>
            </Space>
          </Col>
          <Col span={12}>
            <Space>
              <Tag color="green">营业中</Tag>
              <Tag color="red">暂停营业</Tag>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default MapVisualization