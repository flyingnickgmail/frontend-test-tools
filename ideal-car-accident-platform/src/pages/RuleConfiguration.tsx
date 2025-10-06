import React, { useEffect, useState } from 'react'
import { 
  Card, 
  Table, 
  Tag, 
  Space, 
  Button, 
  Typography, 
  Modal, 
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Row,
  Col,
  message,
  Tabs
} from 'antd'
import { 
  PlusOutlined,
  EditOutlined, 
  DeleteOutlined,
  ReloadOutlined
} from '@ant-design/icons'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

interface Rule {
  id: string
  name: string
  type: 'DISTANCE' | 'PERFORMANCE' | 'QUOTA' | 'TIME' | 'CUSTOM'
  weight: number
  enabled: boolean
  description: string
  parameters: Record<string, any>
  createdAt: string
  updatedAt: string
}

interface RegionRule {
  id: string
  region: string
  city: string
  rules: string[]
  enabled: boolean
  createdAt: string
}

const RuleConfiguration: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([])
  const [regionRules, setRegionRules] = useState<RegionRule[]>([])
  const [isRuleModalVisible, setIsRuleModalVisible] = useState(false)
  const [isRegionModalVisible, setIsRegionModalVisible] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [editingRegionRule, setEditingRegionRule] = useState<RegionRule | null>(null)
  const [form] = Form.useForm()
  const [regionForm] = Form.useForm()

  useEffect(() => {
    loadRules()
    loadRegionRules()
  }, [])

  const loadRules = async () => {
    // 模拟数据
    const mockRules: Rule[] = [
      {
        id: '1',
        name: '距离因子',
        type: 'DISTANCE',
        weight: 40,
        enabled: true,
        description: '基于客户位置和门店位置的距离计算',
        parameters: {
          maxDistance: 50,
          distanceUnit: 'km',
          calculationMethod: 'driving'
        },
        createdAt: '2024-10-01T08:00:00Z',
        updatedAt: '2024-10-01T08:00:00Z'
      },
      {
        id: '2',
        name: '绩效因子',
        type: 'PERFORMANCE',
        weight: 40,
        enabled: true,
        description: '基于门店历史服务评分的绩效评估',
        parameters: {
          scoreSource: 'customer_review',
          timeRange: 30,
          minScore: 3.0
        },
        createdAt: '2024-10-01T08:00:00Z',
        updatedAt: '2024-10-01T08:00:00Z'
      },
      {
        id: '3',
        name: '配额因子',
        type: 'QUOTA',
        weight: 20,
        enabled: true,
        description: '基于门店当前负载和配额的均衡分配',
        parameters: {
          quotaType: 'monthly',
          loadThreshold: 80,
          balanceWeight: 0.5
        },
        createdAt: '2024-10-01T08:00:00Z',
        updatedAt: '2024-10-01T08:00:00Z'
      },
      {
        id: '4',
        name: '时段因子',
        type: 'TIME',
        weight: 10,
        enabled: false,
        description: '基于时间段的特殊规则',
        parameters: {
          peakHours: ['17:00', '19:00'],
          weekendWeight: 1.2,
          holidayWeight: 1.5
        },
        createdAt: '2024-10-01T08:00:00Z',
        updatedAt: '2024-10-01T08:00:00Z'
      }
    ]
    setRules(mockRules)
  }

  const loadRegionRules = async () => {
    // 模拟数据
    const mockRegionRules: RegionRule[] = [
      {
        id: '1',
        region: '华东区域',
        city: '杭州市',
        rules: ['1', '2', '3'],
        enabled: true,
        createdAt: '2024-10-01T08:00:00Z'
      },
      {
        id: '2',
        region: '华东区域',
        city: '上海市',
        rules: ['1', '2', '3', '4'],
        enabled: true,
        createdAt: '2024-10-01T08:00:00Z'
      },
      {
        id: '3',
        region: '华北区域',
        city: '北京市',
        rules: ['1', '2'],
        enabled: true,
        createdAt: '2024-10-01T08:00:00Z'
      }
    ]
    setRegionRules(mockRegionRules)
  }

  const handleCreateRule = () => {
    setEditingRule(null)
    form.resetFields()
    setIsRuleModalVisible(true)
  }

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule)
    form.setFieldsValue(rule)
    setIsRuleModalVisible(true)
  }

  const handleDeleteRule = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个规则吗？',
      onOk: () => {
        setRules(rules.filter(rule => rule.id !== id))
        message.success('删除成功')
      },
    })
  }

  const handleSubmitRule = async (values: any) => {
    try {
      const ruleData: Rule = {
        id: editingRule?.id || Date.now().toString(),
        name: values.name,
        type: values.type,
        weight: values.weight,
        enabled: values.enabled !== false,
        description: values.description,
        parameters: values.parameters || {},
        createdAt: editingRule?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (editingRule) {
        setRules(rules.map(rule => rule.id === editingRule.id ? ruleData : rule))
        message.success('规则更新成功')
      } else {
        setRules([...rules, ruleData])
        message.success('规则创建成功')
      }

      setIsRuleModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleCreateRegionRule = () => {
    setEditingRegionRule(null)
    regionForm.resetFields()
    setIsRegionModalVisible(true)
  }

  const handleEditRegionRule = (regionRule: RegionRule) => {
    setEditingRegionRule(regionRule)
    regionForm.setFieldsValue(regionRule)
    setIsRegionModalVisible(true)
  }

  const handleSubmitRegionRule = async (values: any) => {
    try {
      const regionRuleData: RegionRule = {
        id: editingRegionRule?.id || Date.now().toString(),
        region: values.region,
        city: values.city,
        rules: values.rules,
        enabled: values.enabled !== false,
        createdAt: editingRegionRule?.createdAt || new Date().toISOString()
      }

      if (editingRegionRule) {
        setRegionRules(regionRules.map(rule => rule.id === editingRegionRule.id ? regionRuleData : rule))
        message.success('区域规则更新成功')
      } else {
        setRegionRules([...regionRules, regionRuleData])
        message.success('区域规则创建成功')
      }

      setIsRegionModalVisible(false)
      regionForm.resetFields()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const getRuleTypeTag = (type: string) => {
    const typeMap = {
      DISTANCE: { color: 'blue', text: '距离因子' },
      PERFORMANCE: { color: 'green', text: '绩效因子' },
      QUOTA: { color: 'orange', text: '配额因子' },
      TIME: { color: 'purple', text: '时段因子' },
      CUSTOM: { color: 'cyan', text: '自定义因子' },
    }
    const config = typeMap[type as keyof typeof typeMap]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const ruleColumns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getRuleTypeTag(type),
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => `${weight}%`,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'success' : 'default'}>
          {enabled ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Rule) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEditRule(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRule(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const regionRuleColumns = [
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '应用规则',
      key: 'rules',
      render: (_: any, record: RegionRule) => (
        <Space wrap>
          {record.rules.map(ruleId => {
            const rule = rules.find(r => r.id === ruleId)
            return rule ? getRuleTypeTag(rule.type) : null
          })}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'success' : 'default'}>
          {enabled ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: RegionRule) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEditRegionRule(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  const tabItems = [
    {
      key: 'rules',
      label: '计算因子管理',
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={4}>计算因子列表</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreateRule}
            >
              创建因子
            </Button>
          </div>
          <Table
            columns={ruleColumns}
            dataSource={rules}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: 'regions',
      label: '区域规则配置',
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={4}>区域规则列表</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreateRegionRule}
            >
              创建区域规则
            </Button>
          </div>
          <Table
            columns={regionRuleColumns}
            dataSource={regionRules}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>规则配置中心</Title>
        <Button 
          icon={<ReloadOutlined />}
          onClick={() => {
            loadRules()
            loadRegionRules()
          }}
        >
          刷新数据
        </Button>
      </div>

      <Card className="custom-card">
        <Tabs defaultActiveKey="rules" items={tabItems} />
      </Card>

      {/* 规则编辑模态框 */}
      <Modal
        title={editingRule ? '编辑规则' : '创建规则'}
        open={isRuleModalVisible}
        onCancel={() => setIsRuleModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitRule}
        >
          <Form.Item
            name="name"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder="请输入规则名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="规则类型"
            rules={[{ required: true, message: '请选择规则类型' }]}
          >
            <Select placeholder="请选择规则类型">
              <Option value="DISTANCE">距离因子</Option>
              <Option value="PERFORMANCE">绩效因子</Option>
              <Option value="QUOTA">配额因子</Option>
              <Option value="TIME">时段因子</Option>
              <Option value="CUSTOM">自定义因子</Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="权重 (%)"
                rules={[{ required: true, message: '请输入权重' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="enabled"
                label="启用状态"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="规则描述"
          >
            <TextArea rows={3} placeholder="请输入规则描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 区域规则编辑模态框 */}
      <Modal
        title={editingRegionRule ? '编辑区域规则' : '创建区域规则'}
        open={isRegionModalVisible}
        onCancel={() => setIsRegionModalVisible(false)}
        onOk={() => regionForm.submit()}
        width={600}
      >
        <Form
          form={regionForm}
          layout="vertical"
          onFinish={handleSubmitRegionRule}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="region"
                label="区域"
                rules={[{ required: true, message: '请选择区域' }]}
              >
                <Select placeholder="请选择区域">
                  <Option value="华东区域">华东区域</Option>
                  <Option value="华北区域">华北区域</Option>
                  <Option value="华南区域">华南区域</Option>
                  <Option value="华西区域">华西区域</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="city"
                label="城市"
                rules={[{ required: true, message: '请输入城市' }]}
              >
                <Input placeholder="请输入城市" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="rules"
            label="应用规则"
            rules={[{ required: true, message: '请选择应用规则' }]}
          >
            <Select mode="multiple" placeholder="请选择应用规则">
              {rules.map(rule => (
                <Option key={rule.id} value={rule.id}>
                  {rule.name} ({rule.type})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="enabled"
            label="启用状态"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RuleConfiguration