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
  Timeline
} from 'antd'
import { 
  EyeOutlined, 
  ReloadOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ShareAltOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { setLeads, setAllocationResults } from '../store/slices/leadSlice'
import { Lead } from '../types'
import { mockDashboardData } from '../services/mockData'

const { Title } = Typography

const AllocationMonitor: React.FC = () => {
  const dispatch = useDispatch()
  const { leads } = useSelector((state: RootState) => state.lead)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [isAllocationModalVisible, setIsAllocationModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isAllocating, setIsAllocating] = useState(false)
  const [allocationSteps, setAllocationSteps] = useState<string[]>([])
  const [allocationResult, setAllocationResult] = useState<any>(null)

  useEffect(() => {
    loadAllocationData()
  }, [])

  const loadAllocationData = async () => {
    setLoading(true)
    try {
      const data = await mockDashboardData.getAllocationData()
      dispatch(setLeads(data.leads))
      dispatch(setAllocationResults(data.allocationResults))
    } catch (error) {
      console.error('Failed to load allocation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailModalVisible(true)
  }

  const handleStartAllocation = (lead: Lead) => {
    setSelectedLead(lead)
    setIsAllocationModalVisible(true)
    startAllocationProcess()
  }

  const startAllocationProcess = async () => {
    setIsAllocating(true)
    setAllocationSteps([])
    setAllocationResult(null)

    const steps = [
      '接收线索信息...',
      '分析客户位置和需求...',
      '查询可用门店信息...',
      '计算距离因子得分...',
      '计算绩效因子得分...',
      '计算配额因子得分...',
      '综合计算门店得分...',
      '选择最优门店...',
      '生成分配结果...'
    ]

    for (let i = 0; i < steps.length; i++) {
      setAllocationSteps(prev => [...prev, steps[i]])
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    // 模拟分配结果
    const result = {
      selectedStore: '杭州西湖店',
      storeId: '001',
      score: 87,
      factors: {
        distance: 85,
        performance: 90,
        quota: 88
      },
      reason: '距离最近，绩效优秀，配额充足',
      estimatedTime: '15分钟',
      contactPhone: '0571-88888888'
    }

    setAllocationResult(result)
    setIsAllocating(false)
  }

  const getStatusTag = (status: string) => {
    const statusMap = {
      PENDING: { color: 'processing', text: '待分配' },
      ALLOCATED: { color: 'success', text: '已分配' },
      PROCESSING: { color: 'warning', text: '处理中' },
      COMPLETED: { color: 'success', text: '已完成' },
    }
    const config = statusMap[status as keyof typeof statusMap]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getPriorityTag = (priority: number) => {
    if (priority >= 8) return <Tag color="red">高优先级</Tag>
    if (priority >= 5) return <Tag color="orange">中优先级</Tag>
    return <Tag color="green">低优先级</Tag>
  }

  const columns = [
    {
      title: '线索ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '客户信息',
      key: 'customer',
      render: (_: any, record: Lead) => (
        <div>
          <div>{record.customerName}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.customerType === 'VIP' ? 'VIP客户' : '普通客户'} | {record.vehicleModel}
          </div>
        </div>
      ),
    },
    {
      title: '事故信息',
      key: 'accident',
      render: (_: any, record: Lead) => (
        <div>
          <div>{record.accidentLocation.address}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.accidentType === 'MINOR' ? '轻微' : record.accidentType === 'MAJOR' ? '严重' : '全损'}
          </div>
        </div>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: number) => getPriorityTag(priority),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '分配门店',
      dataIndex: 'assignedStoreId',
      key: 'assignedStoreId',
      render: (storeId: string) => storeId ? `门店${storeId}` : '-',
    },
    {
      title: '报案时间',
      dataIndex: 'reportTime',
      key: 'reportTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Lead) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看详情
          </Button>
          {record.status === 'PENDING' && (
            <Button 
              type="link" 
              icon={<ShareAltOutlined />}
              onClick={() => handleStartAllocation(record)}
            >
              开始分配
            </Button>
          )}
        </Space>
      ),
    },
  ]

  // 统计数据
  const stats = {
    total: leads.length,
    pending: leads.filter((lead: Lead) => lead.status === 'PENDING').length,
    allocated: leads.filter((lead: Lead) => lead.status === 'ALLOCATED').length,
    processing: leads.filter((lead: Lead) => lead.status === 'PROCESSING').length,
    completed: leads.filter((lead: Lead) => lead.status === 'COMPLETED').length,
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>分配监控</Title>
        <Button 
          icon={<ReloadOutlined />}
          onClick={loadAllocationData}
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
              title="总线索数"
              value={stats.total}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="待分配"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="已分配"
              value={stats.allocated}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="处理中"
              value={stats.processing}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 线索列表 */}
      <Card className="custom-card">
        <Table
          columns={columns}
          dataSource={leads}
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
        title="线索详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedLead && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="线索ID">{selectedLead.id}</Descriptions.Item>
              <Descriptions.Item label="客户类型">
                {selectedLead.customerType === 'VIP' ? 'VIP客户' : '普通客户'}
              </Descriptions.Item>
              <Descriptions.Item label="客户姓名">{selectedLead.customerName}</Descriptions.Item>
              <Descriptions.Item label="车辆型号">{selectedLead.vehicleModel}</Descriptions.Item>
              <Descriptions.Item label="事故地点" span={2}>
                {selectedLead.accidentLocation.address}
              </Descriptions.Item>
              <Descriptions.Item label="事故类型">
                {selectedLead.accidentType === 'MINOR' ? '轻微' : selectedLead.accidentType === 'MAJOR' ? '严重' : '全损'}
              </Descriptions.Item>
              <Descriptions.Item label="优先级">
                {getPriorityTag(selectedLead.priority)}
              </Descriptions.Item>
              <Descriptions.Item label="当前状态">
                {getStatusTag(selectedLead.status)}
              </Descriptions.Item>
              <Descriptions.Item label="分配门店">
                {selectedLead.assignedStoreId ? `门店${selectedLead.assignedStoreId}` : '未分配'}
              </Descriptions.Item>
              <Descriptions.Item label="报案时间" span={2}>
                {new Date(selectedLead.reportTime).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            {selectedLead.description && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>事故描述</Title>
                <p>{selectedLead.description}</p>
              </div>
            )}

            {/* 分配历史 */}
            <div style={{ marginTop: 16 }}>
              <Title level={5}>分配历史</Title>
              <Timeline>
                <Timeline.Item color="green">
                  <div>线索创建</div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    {new Date(selectedLead.reportTime).toLocaleString()}
                  </div>
                </Timeline.Item>
                {selectedLead.status !== 'PENDING' && (
                  <Timeline.Item color="blue">
                    <div>线索分配</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      {selectedLead.assignedStoreId ? `分配给门店${selectedLead.assignedStoreId}` : '分配中'}
                    </div>
                  </Timeline.Item>
                )}
                {selectedLead.status === 'COMPLETED' && (
                  <Timeline.Item color="green">
                    <div>处理完成</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      客户满意度: 5星
                    </div>
                  </Timeline.Item>
                )}
              </Timeline>
            </div>
          </div>
        )}
      </Modal>

      {/* 分配过程模态框 */}
      <Modal
        title="智能分配过程"
        open={isAllocationModalVisible}
        onCancel={() => setIsAllocationModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedLead && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <Title level={5}>线索信息</Title>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="客户">{selectedLead.customerName}</Descriptions.Item>
                <Descriptions.Item label="车辆">{selectedLead.vehicleModel}</Descriptions.Item>
                <Descriptions.Item label="事故地点" span={2}>{selectedLead.accidentLocation.address}</Descriptions.Item>
              </Descriptions>
            </div>

            {isAllocating ? (
              <div>
                <Title level={5}>分配过程</Title>
                <Timeline>
                  {allocationSteps.map((step, index) => (
                    <Timeline.Item key={index} color="blue">
                      <div style={{ fontSize: '14px' }}>{step}</div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            ) : allocationResult && (
              <div>
                <Title level={5}>分配结果</Title>
                <Card className="stat-card success">
                  <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: 8 }}>
                      {allocationResult.selectedStore}
                    </div>
                    <div style={{ fontSize: '16px', marginBottom: 16 }}>
                      综合得分: {allocationResult.score}分
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                      预计到达时间: {allocationResult.estimatedTime}
                    </div>
                  </div>
                </Card>

                <div style={{ marginTop: 16 }}>
                  <Title level={5}>分配详情</Title>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic
                          title="距离因子"
                          value={allocationResult.factors.distance}
                          suffix="分"
                          valueStyle={{ color: '#1890ff' }}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic
                          title="绩效因子"
                          value={allocationResult.factors.performance}
                          suffix="分"
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic
                          title="配额因子"
                          value={allocationResult.factors.quota}
                          suffix="分"
                          valueStyle={{ color: '#faad14' }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>

                <div style={{ marginTop: 16 }}>
                  <Title level={5}>分配理由</Title>
                  <p>{allocationResult.reason}</p>
                </div>

                <div style={{ marginTop: 16 }}>
                  <Title level={5}>联系方式</Title>
                  <p>联系电话: {allocationResult.contactPhone}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AllocationMonitor