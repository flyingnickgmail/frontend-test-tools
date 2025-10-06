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
  Input,
  Select,
  message,
  Rate,
  Form
} from 'antd'
import { 
  EyeOutlined, 
  ReloadOutlined,
  SearchOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  StarOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { setLeads } from '../store/slices/leadSlice'
import { Lead } from '../types'
import { mockDashboardData } from '../services/mockData'

const { Title } = Typography
const { Search } = Input
const { Option } = Select
const { TextArea } = Input

interface CustomerFeedback {
  id: string
  leadId: string
  customerName: string
  rating: number
  comment: string
  timestamp: string
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED'
}

interface Notification {
  id: string
  leadId: string
  customerName: string
  type: 'ALLOCATION' | 'CONFIRMATION' | 'REMINDER' | 'COMPLETION'
  title: string
  content: string
  status: 'SENT' | 'DELIVERED' | 'READ' | 'CONFIRMED'
  timestamp: string
}

const CustomerInteraction: React.FC = () => {
  const dispatch = useDispatch()
  const { leads } = useSelector((state: RootState) => state.lead)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [form] = Form.useForm()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await mockDashboardData.getAllocationData()
      dispatch(setLeads(data.leads))
      
      // 模拟客户反馈数据
      const mockFeedback: CustomerFeedback[] = [
        {
          id: '1',
          leadId: 'L001',
          customerName: '张先生',
          rating: 5,
          comment: '服务非常及时，师傅很专业，非常满意！',
          timestamp: '2024-10-15T16:30:00Z',
          status: 'REVIEWED'
        },
        {
          id: '2',
          leadId: 'L002',
          customerName: '李女士',
          rating: 4,
          comment: '整体服务不错，但等待时间稍长',
          timestamp: '2024-10-15T15:45:00Z',
          status: 'PENDING'
        },
        {
          id: '3',
          leadId: 'L003',
          customerName: '王先生',
          rating: 5,
          comment: '理想汽车的服务确实很好，推荐！',
          timestamp: '2024-10-15T14:20:00Z',
          status: 'RESOLVED'
        }
      ]
      setFeedback(mockFeedback)

      // 模拟通知数据
      const mockNotifications: Notification[] = [
        {
          id: '1',
          leadId: 'L001',
          customerName: '张先生',
          type: 'ALLOCATION',
          title: '线索分配通知',
          content: '您的线索已分配给杭州西湖店，预计15分钟内到达',
          status: 'CONFIRMED',
          timestamp: '2024-10-15T14:30:00Z'
        },
        {
          id: '2',
          leadId: 'L002',
          customerName: '李女士',
          type: 'CONFIRMATION',
          title: '服务确认',
          content: '请确认是否接受杭州滨江店的服务安排',
          status: 'READ',
          timestamp: '2024-10-15T15:15:00Z'
        },
        {
          id: '3',
          leadId: 'L003',
          customerName: '王先生',
          type: 'COMPLETION',
          title: '服务完成',
          content: '您的车辆维修已完成，请对服务进行评价',
          status: 'DELIVERED',
          timestamp: '2024-10-15T16:00:00Z'
        }
      ]
      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailModalVisible(true)
  }

  const handleSendNotification = (lead: Lead) => {
    const notification: Notification = {
      id: Date.now().toString(),
      leadId: lead.id,
      customerName: lead.customerName,
      type: 'ALLOCATION',
      title: '线索分配通知',
      content: `您的线索已分配给门店${lead.assignedStoreId}，预计15分钟内到达`,
      status: 'SENT',
      timestamp: new Date().toISOString()
    }
    setNotifications([notification, ...notifications])
    message.success('通知发送成功')
  }

  const handleRequestFeedback = (lead: Lead) => {
    setSelectedLead(lead)
    setIsFeedbackModalVisible(true)
  }

  const handleSubmitFeedback = async (values: any) => {
    try {
      const feedbackData: CustomerFeedback = {
        id: Date.now().toString(),
        leadId: selectedLead!.id,
        customerName: selectedLead!.customerName,
        rating: values.rating,
        comment: values.comment,
        timestamp: new Date().toISOString(),
        status: 'PENDING'
      }
      setFeedback([feedbackData, ...feedback])
      message.success('反馈提交成功')
      setIsFeedbackModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('提交失败')
    }
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

  const getNotificationTypeTag = (type: string) => {
    const typeMap = {
      ALLOCATION: { color: 'blue', text: '分配通知' },
      CONFIRMATION: { color: 'orange', text: '确认通知' },
      REMINDER: { color: 'purple', text: '提醒通知' },
      COMPLETION: { color: 'green', text: '完成通知' },
    }
    const config = typeMap[type as keyof typeof typeMap]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getNotificationStatusTag = (status: string) => {
    const statusMap = {
      SENT: { color: 'default', text: '已发送' },
      DELIVERED: { color: 'blue', text: '已送达' },
      READ: { color: 'orange', text: '已读' },
      CONFIRMED: { color: 'green', text: '已确认' },
    }
    const config = statusMap[status as keyof typeof statusMap]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesSearch = 
      lead.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchText.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{record.customerName}</span>
            {record.customerType === 'VIP' ? <Tag color="gold">VIP</Tag> : <Tag color="blue">普通</Tag>}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.vehicleModel}
          </div>
        </div>
      ),
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
            查看
          </Button>
          {record.status === 'ALLOCATED' && (
            <Button 
              type="link" 
              icon={<MessageOutlined />}
              onClick={() => handleSendNotification(record)}
            >
              发送通知
            </Button>
          )}
          {record.status === 'COMPLETED' && (
            <Button 
              type="link" 
              icon={<StarOutlined />}
              onClick={() => handleRequestFeedback(record)}
            >
              收集反馈
            </Button>
          )}
        </Space>
      ),
    },
  ]

  // 统计数据
  const stats = {
    totalLeads: leads.length,
    allocatedLeads: leads.filter((lead: Lead) => lead.status === 'ALLOCATED').length,
    completedLeads: leads.filter((lead: Lead) => lead.status === 'COMPLETED').length,
    totalNotifications: notifications.length,
    confirmedNotifications: notifications.filter(n => n.status === 'CONFIRMED').length,
    totalFeedback: feedback.length,
    avgRating: feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : 0,
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>客户交互中心</Title>
        <Button 
          icon={<ReloadOutlined />}
          onClick={loadData}
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
              value={stats.totalLeads}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="已分配"
              value={stats.allocatedLeads}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="已完成"
              value={stats.completedLeads}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="平均评分"
              value={stats.avgRating.toFixed(1)}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选条件 */}
      <Card className="custom-card" style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Search
              placeholder="搜索客户姓名或线索ID"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col>
            <span>状态：</span>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
            >
              <Option value="all">全部</Option>
              <Option value="PENDING">待分配</Option>
              <Option value="ALLOCATED">已分配</Option>
              <Option value="PROCESSING">处理中</Option>
              <Option value="COMPLETED">已完成</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 线索列表 */}
      <Card className="custom-card" style={{ marginBottom: 24 }}>
        <Title level={4}>线索列表</Title>
        <Table
          columns={columns}
          dataSource={filteredLeads}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* 通知记录 */}
      <Card className="custom-card" style={{ marginBottom: 24 }}>
        <Title level={4}>通知记录</Title>
        <Table
          columns={[
            {
              title: '客户',
              dataIndex: 'customerName',
              key: 'customerName',
            },
            {
              title: '类型',
              dataIndex: 'type',
              key: 'type',
              render: (type: string) => getNotificationTypeTag(type),
            },
            {
              title: '标题',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: '内容',
              dataIndex: 'content',
              key: 'content',
              ellipsis: true,
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => getNotificationStatusTag(status),
            },
            {
              title: '时间',
              dataIndex: 'timestamp',
              key: 'timestamp',
              render: (time: string) => new Date(time).toLocaleString(),
            },
          ]}
          dataSource={notifications}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* 客户反馈 */}
      <Card className="custom-card">
        <Title level={4}>客户反馈</Title>
        <Table
          columns={[
            {
              title: '客户',
              dataIndex: 'customerName',
              key: 'customerName',
            },
            {
              title: '评分',
              dataIndex: 'rating',
              key: 'rating',
              render: (rating: number) => <Rate disabled value={rating} />,
            },
            {
              title: '评价',
              dataIndex: 'comment',
              key: 'comment',
              ellipsis: true,
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => (
                <Tag color={status === 'RESOLVED' ? 'success' : status === 'REVIEWED' ? 'blue' : 'orange'}>
                  {status === 'RESOLVED' ? '已处理' : status === 'REVIEWED' ? '已查看' : '待处理'}
                </Tag>
              ),
            },
            {
              title: '时间',
              dataIndex: 'timestamp',
              key: 'timestamp',
              render: (time: string) => new Date(time).toLocaleString(),
            },
          ]}
          dataSource={feedback}
          rowKey="id"
          pagination={{ pageSize: 5 }}
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
          </div>
        )}
      </Modal>

      {/* 反馈收集模态框 */}
      <Modal
        title="收集客户反馈"
        open={isFeedbackModalVisible}
        onCancel={() => setIsFeedbackModalVisible(false)}
        onOk={() => form.submit()}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitFeedback}
        >
          <Form.Item
            name="rating"
            label="服务评分"
            rules={[{ required: true, message: '请选择服务评分' }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="comment"
            label="评价内容"
            rules={[{ required: true, message: '请输入评价内容' }]}
          >
            <TextArea rows={4} placeholder="请输入您的评价" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CustomerInteraction