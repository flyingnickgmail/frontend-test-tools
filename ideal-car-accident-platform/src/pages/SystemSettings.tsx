import React, { useState } from 'react'
import { 
  Card, 
  Tabs, 
  Form, 
  Input, 
  Switch, 
  Button, 
  Typography, 
  Row, 
  Col,
  Select,
  InputNumber,
  message,
  Space
} from 'antd'
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons'

const { Title } = Typography
const { Option } = Select
// const { TextArea } = Input

const SystemSettings: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('设置保存成功')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    form.resetFields()
    message.info('已重置为默认值')
  }

  const tabItems = [
    {
      key: 'general',
      label: '通用设置',
      children: (
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
              systemName: '理想汽车事故线索智能分配平台',
              timezone: 'Asia/Shanghai',
              language: 'zh-CN',
              autoRefresh: true,
              refreshInterval: 30,
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="systemName"
                  label="系统名称"
                  rules={[{ required: true, message: '请输入系统名称' }]}
                >
                  <Input placeholder="请输入系统名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="timezone"
                  label="时区"
                  rules={[{ required: true, message: '请选择时区' }]}
                >
                  <Select placeholder="请选择时区">
                    <Option value="Asia/Shanghai">北京时间 (UTC+8)</Option>
                    <Option value="UTC">协调世界时 (UTC)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="language"
                  label="语言"
                  rules={[{ required: true, message: '请选择语言' }]}
                >
                  <Select placeholder="请选择语言">
                    <Option value="zh-CN">简体中文</Option>
                    <Option value="en-US">English</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="refreshInterval"
                  label="自动刷新间隔(秒)"
                  rules={[{ required: true, message: '请输入刷新间隔' }]}
                >
                  <InputNumber min={10} max={300} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="autoRefresh"
              label="启用自动刷新"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'allocation',
      label: '分配设置',
      children: (
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
              defaultModel: 'DISTANCE_PERFORMANCE',
              maxRetryTimes: 3,
              timeoutSeconds: 30,
              enableFallback: true,
              fallbackModel: 'QUOTA_BALANCE',
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="defaultModel"
                  label="默认分配模型"
                  rules={[{ required: true, message: '请选择默认模型' }]}
                >
                  <Select placeholder="请选择默认模型">
                    <Option value="DISTANCE_PERFORMANCE">距离+绩效模型</Option>
                    <Option value="QUOTA_BALANCE">配额平衡模型</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="maxRetryTimes"
                  label="最大重试次数"
                  rules={[{ required: true, message: '请输入最大重试次数' }]}
                >
                  <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="timeoutSeconds"
                  label="超时时间(秒)"
                  rules={[{ required: true, message: '请输入超时时间' }]}
                >
                  <InputNumber min={5} max={120} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="fallbackModel"
                  label="备用分配模型"
                  rules={[{ required: true, message: '请选择备用模型' }]}
                >
                  <Select placeholder="请选择备用模型">
                    <Option value="DISTANCE_PERFORMANCE">距离+绩效模型</Option>
                    <Option value="QUOTA_BALANCE">配额平衡模型</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="enableFallback"
              label="启用备用模型"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'notification',
      label: '通知设置',
      children: (
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
              emailNotification: true,
              smsNotification: false,
              webhookUrl: '',
              notificationTypes: ['allocation', 'error', 'warning'],
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="emailNotification"
                  label="邮件通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="smsNotification"
                  label="短信通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="webhookUrl"
              label="Webhook URL"
            >
              <Input placeholder="请输入Webhook URL" />
            </Form.Item>

            <Form.Item
              name="notificationTypes"
              label="通知类型"
            >
              <Select mode="multiple" placeholder="请选择通知类型">
                <Option value="allocation">分配结果</Option>
                <Option value="error">系统错误</Option>
                <Option value="warning">警告信息</Option>
                <Option value="info">一般信息</Option>
              </Select>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'security',
      label: '安全设置',
      children: (
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
              sessionTimeout: 30,
              maxLoginAttempts: 5,
              passwordMinLength: 8,
              enableTwoFactor: false,
              logLevel: 'INFO',
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="sessionTimeout"
                  label="会话超时时间(分钟)"
                  rules={[{ required: true, message: '请输入会话超时时间' }]}
                >
                  <InputNumber min={5} max={480} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="maxLoginAttempts"
                  label="最大登录尝试次数"
                  rules={[{ required: true, message: '请输入最大登录尝试次数' }]}
                >
                  <InputNumber min={3} max={20} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="passwordMinLength"
                  label="密码最小长度"
                  rules={[{ required: true, message: '请输入密码最小长度' }]}
                >
                  <InputNumber min={6} max={32} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="logLevel"
                  label="日志级别"
                  rules={[{ required: true, message: '请选择日志级别' }]}
                >
                  <Select placeholder="请选择日志级别">
                    <Option value="DEBUG">DEBUG</Option>
                    <Option value="INFO">INFO</Option>
                    <Option value="WARN">WARN</Option>
                    <Option value="ERROR">ERROR</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="enableTwoFactor"
              label="启用双因子认证"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Card>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>系统设置</Title>
        <Space>
          <Button 
            icon={<ReloadOutlined />}
            onClick={handleReset}
          >
            重置
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            loading={loading}
            onClick={() => form.submit()}
          >
            保存设置
          </Button>
        </Space>
      </div>

      <Card className="custom-card">
        <Tabs
          defaultActiveKey="general"
          items={tabItems}
          onChange={() => {
            // 切换标签页时的处理
          }}
        />
      </Card>
    </div>
  )
}

export default SystemSettings