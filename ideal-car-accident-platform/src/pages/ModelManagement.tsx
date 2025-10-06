import React, { useEffect, useState } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Typography, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Slider,
  Row,
  Col,
  message,
  Progress,
  Steps,
  Descriptions,
  Statistic
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { setModels, addModel, updateModel, deleteModel } from '../store/slices/modelSlice'
import { AllocationModel } from '../types'
import { mockDashboardData } from '../services/mockData'

const { Title } = Typography
const { Option } = Select

const ModelManagement: React.FC = () => {
  const dispatch = useDispatch()
  const { models } = useSelector((state: RootState) => state.model)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isTestModalVisible, setIsTestModalVisible] = useState(false)
  const [editingModel, setEditingModel] = useState<AllocationModel | null>(null)
  const [testingModel, setTestingModel] = useState<AllocationModel | null>(null)
  const [testProgress, setTestProgress] = useState(0)
  const [testResults, setTestResults] = useState<any>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    try {
      const data = await mockDashboardData.getModels()
      dispatch(setModels(data))
    } catch (error) {
      console.error('Failed to load models:', error)
    }
  }

  const handleCreate = () => {
    setEditingModel(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (model: AllocationModel) => {
    setEditingModel(model)
    form.setFieldsValue(model)
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个模型吗？',
      onOk: () => {
        dispatch(deleteModel(id))
        message.success('删除成功')
      },
    })
  }

  const handleTest = (model: AllocationModel) => {
    setTestingModel(model)
    setTestProgress(0)
    setTestResults(null)
    setIsTestModalVisible(true)
    startModelTest()
  }

  const startModelTest = async () => {
    // 模拟测试过程
    const steps = [
      { title: '准备测试数据', description: '加载历史线索数据' },
      { title: '执行分配计算', description: '应用模型进行分配计算' },
      { title: '分析结果', description: '计算分配效果指标' },
      { title: '生成报告', description: '生成测试报告' },
    ]

    for (let i = 0; i < steps.length; i++) {
      setTestProgress((i + 1) * 25)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // 模拟测试结果
    setTestResults({
      allocationRate: 95.2,
      loadBalance: 87.6,
      avgProcessingTime: 28,
      customerSatisfaction: 4.7,
      totalLeads: 1000,
      allocatedLeads: 952,
      errorRate: 4.8,
      performance: '优秀'
    })
  }

  const handleSubmit = async (values: any) => {
    try {
      const modelData: AllocationModel = {
        id: editingModel?.id || Date.now().toString(),
        name: values.name,
        version: editingModel?.version || '1.0',
        type: values.type,
        parameters: {
          distanceWeight: values.distanceWeight,
          performanceWeight: values.performanceWeight,
          quotaWeight: values.quotaWeight,
        },
        scope: {
          regions: values.regions || [],
          cities: values.cities || [],
        },
        status: editingModel?.status || 'DRAFT',
        createdAt: editingModel?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current_user',
        description: values.description,
      }

      if (editingModel) {
        dispatch(updateModel(modelData))
        message.success('更新成功')
      } else {
        dispatch(addModel(modelData))
        message.success('创建成功')
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const columns = [
    {
      title: '模型名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'DISTANCE_PERFORMANCE' ? 'blue' : 'green'}>
          {type === 'DISTANCE_PERFORMANCE' ? '距离+绩效模型' : '配额平衡模型'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          DRAFT: { color: 'default', text: '草稿' },
          TESTING: { color: 'processing', text: '测试中' },
          APPROVED: { color: 'success', text: '已审批' },
          ACTIVE: { color: 'success', text: '已启用' },
          DEPRECATED: { color: 'error', text: '已废弃' },
        }
        const config = statusMap[status as keyof typeof statusMap]
        return <Tag color={config.color}>{config.text}</Tag>
      },
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
      render: (_: any, record: AllocationModel) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            icon={<PlayCircleOutlined />}
            disabled={record.status !== 'APPROVED'}
            onClick={() => handleTest(record)}
          >
            测试
          </Button>
          <Button 
            type="link" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>模型管理</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          创建模型
        </Button>
      </div>

      <Card className="custom-card">
        <Table
          columns={columns}
          dataSource={models}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title={editingModel ? '编辑模型' : '创建模型'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="模型名称"
            rules={[{ required: true, message: '请输入模型名称' }]}
          >
            <Input placeholder="请输入模型名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="模型类型"
            rules={[{ required: true, message: '请选择模型类型' }]}
          >
            <Select placeholder="请选择模型类型">
              <Option value="DISTANCE_PERFORMANCE">距离+绩效模型</Option>
              <Option value="QUOTA_BALANCE">配额平衡模型</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="模型描述"
          >
            <Input.TextArea rows={3} placeholder="请输入模型描述" />
          </Form.Item>

          <Title level={4}>参数配置</Title>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="distanceWeight"
                label="距离权重"
                rules={[{ required: true, message: '请设置距离权重' }]}
              >
                <Slider
                  min={0}
                  max={100}
                  marks={{ 0: '0%', 50: '50%', 100: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="performanceWeight"
                label="绩效权重"
                rules={[{ required: true, message: '请设置绩效权重' }]}
              >
                <Slider
                  min={0}
                  max={100}
                  marks={{ 0: '0%', 50: '50%', 100: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="quotaWeight"
                label="配额权重"
                rules={[{ required: true, message: '请设置配额权重' }]}
              >
                <Slider
                  min={0}
                  max={100}
                  marks={{ 0: '0%', 50: '50%', 100: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 模型测试模态框 */}
      <Modal
        title={`模型测试 - ${testingModel?.name}`}
        open={isTestModalVisible}
        onCancel={() => setIsTestModalVisible(false)}
        footer={null}
        width={800}
      >
        {testingModel && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="模型名称">{testingModel.name}</Descriptions.Item>
              <Descriptions.Item label="模型类型">
                {testingModel.type === 'DISTANCE_PERFORMANCE' ? '距离+绩效模型' : '配额平衡模型'}
              </Descriptions.Item>
              <Descriptions.Item label="距离权重">{testingModel.parameters.distanceWeight}%</Descriptions.Item>
              <Descriptions.Item label="绩效权重">{testingModel.parameters.performanceWeight}%</Descriptions.Item>
              <Descriptions.Item label="配额权重">{testingModel.parameters.quotaWeight}%</Descriptions.Item>
              <Descriptions.Item label="适用范围">
                {testingModel.scope.cities.join(', ')}
              </Descriptions.Item>
            </Descriptions>

            {testProgress < 100 ? (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <Progress percent={testProgress} status="active" />
                </div>
                <Steps
                  current={Math.floor(testProgress / 25)}
                  items={[
                    { title: '准备测试数据', description: '加载历史线索数据' },
                    { title: '执行分配计算', description: '应用模型进行分配计算' },
                    { title: '分析结果', description: '计算分配效果指标' },
                    { title: '生成报告', description: '生成测试报告' },
                  ]}
                />
              </div>
            ) : testResults && (
              <div>
                <Title level={4}>测试结果</Title>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="分配成功率"
                        value={testResults.allocationRate}
                        suffix="%"
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="负载均衡度"
                        value={testResults.loadBalance}
                        suffix="%"
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="平均处理时间"
                        value={testResults.avgProcessingTime}
                        suffix="分钟"
                        valueStyle={{ color: '#faad14' }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="客户满意度"
                        value={testResults.customerSatisfaction}
                        suffix="/5.0"
                        valueStyle={{ color: '#13c2c2' }}
                      />
                    </Card>
                  </Col>
                </Row>
                
                <div style={{ marginTop: 16 }}>
                  <Title level={5}>测试详情</Title>
                  <Descriptions column={2} bordered>
                    <Descriptions.Item label="测试线索数">{testResults.totalLeads}</Descriptions.Item>
                    <Descriptions.Item label="成功分配数">{testResults.allocatedLeads}</Descriptions.Item>
                    <Descriptions.Item label="错误率">{testResults.errorRate}%</Descriptions.Item>
                    <Descriptions.Item label="性能评级">
                      <Tag color={testResults.performance === '优秀' ? 'green' : 'orange'}>
                        {testResults.performance}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ModelManagement