import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  SettingOutlined,
  BarChartOutlined,
  ShopOutlined,
  ShareAltOutlined,
  ControlOutlined,
  UserOutlined,
  BulbOutlined,
  MessageOutlined,
} from '@ant-design/icons'

const { Sider } = Layout

const AppSidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/leads',
      icon: <UserOutlined />,
      label: '线索管理',
    },
    {
      key: '/model',
      icon: <ControlOutlined />,
      label: '模型管理',
    },
    {
      key: '/rules',
      icon: <BulbOutlined />,
      label: '规则配置',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: '数据分析',
    },
    {
      key: '/interaction',
      icon: <MessageOutlined />,
      label: '客户交互',
    },
    {
      key: '/allocation',
      icon: <ShareAltOutlined />,
      label: '分配监控',
    },
    {
      key: '/store',
      icon: <ShopOutlined />,
      label: '门店管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={200}
      style={{
        background: '#fff',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ 
        height: '64px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid #f0f0f0'
      }}>
        {!collapsed && (
          <span style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: '#1890ff' 
          }}>
            理想汽车
          </span>
        )}
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          border: 'none',
          height: 'calc(100vh - 64px)',
        }}
      />
    </Sider>
  )
}

export default AppSidebar