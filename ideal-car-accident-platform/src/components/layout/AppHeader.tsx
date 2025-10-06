import React from 'react'
import { Layout, Avatar, Dropdown, Menu, Space, Typography } from 'antd'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { logout } from '../../store/slices/userSlice'

const { Header } = Layout
const { Text } = Typography

const AppHeader: React.FC = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state: RootState) => state.user)

  const handleLogout = () => {
    dispatch(logout())
  }

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人资料
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        系统设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  )

  return (
    <Header className="app-header" style={{ 
      background: '#fff', 
      padding: '0 24px', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>
        <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
          理想汽车事故线索智能分配平台
        </Text>
      </div>
      
      <Space>
        <Text type="secondary">
          {currentUser?.name || '管理员'}
        </Text>
        <Dropdown overlay={menu} placement="bottomRight">
          <Avatar 
            size="small" 
            icon={<UserOutlined />} 
            style={{ cursor: 'pointer' }}
          />
        </Dropdown>
      </Space>
    </Header>
  )
}

export default AppHeader