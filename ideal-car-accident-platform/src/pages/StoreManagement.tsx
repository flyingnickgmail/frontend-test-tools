import React, { useEffect, useState } from 'react'
import { 
  Card, 
  Table, 
  Tag, 
  Space, 
  Button, 
  Typography, 
  Modal, 
  Descriptions,
  Row,
  Col,
  Statistic,
  Progress,
  Input
} from 'antd'
import { 
  EyeOutlined, 
  EditOutlined, 
  ReloadOutlined,
  SearchOutlined,
  ShopOutlined,
  PhoneOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { setStores } from '../store/slices/storeSlice'
import { Store } from '../types'
import { mockDashboardData } from '../services/mockData'

const { Title } = Typography
const { Search } = Input

const StoreManagement: React.FC = () => {
  const dispatch = useDispatch()
  const { stores } = useSelector((state: RootState) => state.store)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    loadStores()
  }, [])

  const loadStores = async () => {
    setLoading(true)
    try {
      const data = await mockDashboardData.getStores()
      dispatch(setStores(data))
    } catch (error) {
      console.error('Failed to load stores:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (store: Store) => {
    setSelectedStore(store)
    setIsDetailModalVisible(true)
  }

  const getStatusTag = (status: string) => {
    const statusMap = {
      ACTIVE: { color: 'success', text: '营业中' },
      INACTIVE: { color: 'default', text: '暂停营业' },
      MAINTENANCE: { color: 'warning', text: '维护中' },
    }
    const config = statusMap[status as keyof typeof statusMap]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getTypeTag = (type: string) => {
    return (
      <Tag color={type === 'DIRECT' ? 'blue' : 'green'}>
        {type === 'DIRECT' ? '直营店' : '授权店'}
      </Tag>
    )
  }

  const getLoadRate = (currentLoad: number, capacity: number) => {
    const rate = (currentLoad / capacity) * 100
    let color = 'success'
    if (rate > 80) color = 'error'
    else if (rate > 60) color = 'warning'
    
    return (
      <Progress 
        percent={Math.round(rate)} 
        size="small" 
        status={color as any}
        format={(percent) => `${percent}%`}
      />
    )
  }

  const filteredStores = stores.filter((store: Store) => 
    store.name.toLowerCase().includes(searchText.toLowerCase()) ||
    store.address.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Store) => (
        <div>
          <div>{name}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.address}
          </div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getTypeTag(type),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '服务评分',
      dataIndex: 'performanceScore',
      key: 'performanceScore',
      render: (score: number) => (
        <div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {score.toFixed(1)}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            / 5.0
          </div>
        </div>
      ),
    },
    {
      title: '负载率',
      key: 'loadRate',
      render: (_: any, record: Store) => getLoadRate(record.currentLoad, record.capacity),
    },
    {
      title: '月度配额',
      key: 'quota',
      render: (_: any, record: Store) => (
        <div>
          <div>{record.quota.completed} / {record.quota.monthly}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            完成率: {Math.round((record.quota.completed / record.quota.monthly) * 100)}%
          </div>
        </div>
      ),
    },
    {
      title: '联系方式',
      dataIndex: 'contactInfo',
      key: 'contactInfo',
      render: (contact: Store['contactInfo']) => (
        <div>
          <div><PhoneOutlined /> {contact.phone}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            <UserOutlined /> {contact.manager}
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Store) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看详情
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  // 统计数据
  const stats = {
    total: stores.length,
    active: stores.filter((store: Store) => store.status === 'ACTIVE').length,
    direct: stores.filter((store: Store) => store.type === 'DIRECT').length,
    authorized: stores.filter((store: Store) => store.type === 'AUTHORIZED').length,
    avgScore: stores.reduce((sum: number, store: Store) => sum + store.performanceScore, 0) / stores.length,
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>门店管理</Title>
        <Button 
          icon={<ReloadOutlined />}
          onClick={loadStores}
          loading={loading}
        >
          刷新数据
        </Button>
      </div>

      {/* 统计概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总门店数"
              value={stats.total}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="营业中"
              value={stats.active}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="直营店"
              value={stats.direct}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="平均评分"
              value={stats.avgScore.toFixed(1)}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选 */}
      <Card className="custom-card" style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Search
              placeholder="搜索门店名称或地址"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
          </Col>
        </Row>
      </Card>

      {/* 门店列表 */}
      <Card className="custom-card">
        <Table
          columns={columns}
          dataSource={filteredStores}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* 详情模态框 */}
      <Modal
        title="门店详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedStore && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="门店名称">{selectedStore.name}</Descriptions.Item>
              <Descriptions.Item label="门店类型">
                {getTypeTag(selectedStore.type)}
              </Descriptions.Item>
              <Descriptions.Item label="门店地址" span={2}>
                {selectedStore.address}
              </Descriptions.Item>
              <Descriptions.Item label="营业状态">
                {getStatusTag(selectedStore.status)}
              </Descriptions.Item>
              <Descriptions.Item label="服务评分">
                {selectedStore.performanceScore.toFixed(1)} / 5.0
              </Descriptions.Item>
              <Descriptions.Item label="服务半径">
                {selectedStore.serviceRadius} 公里
              </Descriptions.Item>
              <Descriptions.Item label="容量">
                {selectedStore.capacity} 个工位
              </Descriptions.Item>
              <Descriptions.Item label="当前负载">
                {selectedStore.currentLoad} / {selectedStore.capacity}
              </Descriptions.Item>
              <Descriptions.Item label="负载率">
                {getLoadRate(selectedStore.currentLoad, selectedStore.capacity)}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {selectedStore.contactInfo.phone}
              </Descriptions.Item>
              <Descriptions.Item label="店长">
                {selectedStore.contactInfo.manager}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <Title level={5}>配额完成情况</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Card size="small">
                    <Statistic
                      title="日配额"
                      value={selectedStore.quota.daily}
                      suffix="条/天"
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small">
                    <Statistic
                      title="月配额"
                      value={selectedStore.quota.completed}
                      suffix={`/ ${selectedStore.quota.monthly}`}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default StoreManagement