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
  Form,
  message
} from 'antd'
import { 
  PlusOutlined,
  EyeOutlined, 
  EditOutlined, 
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { setLeads, addLead, updateLead } from '../store/slices/leadSlice'
import { Lead } from '../types'
import { mockDashboardData } from '../services/mockData'

const { Title } = Typography
const { Search } = Input
const { Option } = Select

const LeadManagement: React.FC = () => {
  const dispatch = useDispatch()
  const { leads } = useSelector((state: RootState) => state.lead)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>('all')
  const [form] = Form.useForm()

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    setLoading(true)
    try {
      const data = await mockDashboardData.getAllocationData()
      dispatch(setLeads(data.leads))
    } catch (error) {
      console.error('Failed to load leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLead = () => {
    setSelectedLead(null)
    form.resetFields()
    setIsCreateModalVisible(true)
  }

  const handleViewDetail = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailModalVisible(true)
  }

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead)
    form.setFieldsValue(lead)
    setIsCreateModalVisible(true)
  }

  const handleSubmitLead = async (values: any) => {
    try {
      const leadData: Lead = {
        id: selectedLead?.id || `L${Date.now()}`,
        customerId: values.customerId || `C${Date.now()}`,
        customerName: values.customerName,
        customerType: values.customerType,
        vehicleModel: values.vehicleModel,
        accidentLocation: {
          address: values.accidentAddress,
          coordinates: [120.135, 30.259] as [number, number],
        },
        accidentType: values.accidentType,
        reportTime: selectedLead?.reportTime || new Date().toISOString(),
        status: selectedLead?.status || 'PENDING',
        priority: values.priority || 5,
        description: values.description,
      }

      if (selectedLead) {
        dispatch(updateLead(leadData))
        message.success('线索更新成功')
      } else {
        dispatch(addLead(leadData))
        message.success('线索创建成功')
      }

      setIsCreateModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('操作失败')
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

  const getPriorityTag = (priority: number) => {
    if (priority >= 8) return <Tag color="red">高优先级</Tag>
    if (priority >= 5) return <Tag color="orange">中优先级</Tag>
    return <Tag color="green">低优先级</Tag>
  }

  const getCustomerTypeTag = (type: string) => {
    return type === 'VIP' ? <Tag color="gold">VIP客户</Tag> : <Tag color="blue">普通客户</Tag>
  }

  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesSearch = 
      lead.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.accidentLocation.address.toLowerCase().includes(searchText.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesCustomerType = customerTypeFilter === 'all' || lead.customerType === customerTypeFilter
    
    return matchesSearch && matchesStatus && matchesCustomerType
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
            {getCustomerTypeTag(record.customerType)}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.vehicleModel}
          </div>
        </div>
      ),
    },
    {
      title: '事故信息',
      key: 'accident',
      render: (_: any, record: Lead) => (
        <div>
          <div style={{ fontSize: '12px' }}>{record.accidentLocation.address}</div>
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
            查看
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEditLead(record)}
          >
            编辑
          </Button>
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
    vip: leads.filter((lead: Lead) => lead.customerType === 'VIP').length,
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>线索管理</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreateLead}
        >
          创建线索
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
              title="VIP客户"
              value={stats.vip}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选条件 */}
      <Card className="custom-card" style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Search
              placeholder="搜索客户姓名、线索ID或地址"
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
          <Col>
            <span>客户类型：</span>
            <Select
              value={customerTypeFilter}
              onChange={setCustomerTypeFilter}
              style={{ width: 120 }}
            >
              <Option value="all">全部</Option>
              <Option value="VIP">VIP客户</Option>
              <Option value="NORMAL">普通客户</Option>
            </Select>
          </Col>
          <Col>
            <Button 
              icon={<ReloadOutlined />}
              onClick={loadLeads}
              loading={loading}
            >
              刷新
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 线索列表 */}
      <Card className="custom-card">
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
                {getCustomerTypeTag(selectedLead.customerType)}
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
          </div>
        )}
      </Modal>

      {/* 创建/编辑模态框 */}
      <Modal
        title={selectedLead ? '编辑线索' : '创建线索'}
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitLead}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="客户姓名"
                rules={[{ required: true, message: '请输入客户姓名' }]}
              >
                <Input placeholder="请输入客户姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerType"
                label="客户类型"
                rules={[{ required: true, message: '请选择客户类型' }]}
              >
                <Select placeholder="请选择客户类型">
                  <Option value="VIP">VIP客户</Option>
                  <Option value="NORMAL">普通客户</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="vehicleModel"
                label="车辆型号"
                rules={[{ required: true, message: '请输入车辆型号' }]}
              >
                <Input placeholder="请输入车辆型号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="accidentType"
                label="事故类型"
                rules={[{ required: true, message: '请选择事故类型' }]}
              >
                <Select placeholder="请选择事故类型">
                  <Option value="MINOR">轻微</Option>
                  <Option value="MAJOR">严重</Option>
                  <Option value="TOTAL_LOSS">全损</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="accidentAddress"
            label="事故地点"
            rules={[{ required: true, message: '请输入事故地点' }]}
          >
            <Input placeholder="请输入事故地点" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请设置优先级' }]}
              >
                <Select placeholder="请选择优先级">
                  <Option value={3}>低优先级</Option>
                  <Option value={5}>中优先级</Option>
                  <Option value={8}>高优先级</Option>
                  <Option value={10}>紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerId"
                label="客户ID"
              >
                <Input placeholder="客户ID（可选）" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="事故描述"
          >
            <Input.TextArea rows={3} placeholder="请输入事故描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default LeadManagement