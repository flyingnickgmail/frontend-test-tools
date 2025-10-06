// import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import AppHeader from './components/layout/AppHeader'
import AppSidebar from './components/layout/AppSidebar'
import Dashboard from './pages/Dashboard'
import LeadManagement from './pages/LeadManagement'
import ModelManagement from './pages/ModelManagement'
import RuleConfiguration from './pages/RuleConfiguration'
import DataAnalytics from './pages/DataAnalytics'
import CustomerInteraction from './pages/CustomerInteraction'
import StoreManagement from './pages/StoreManagement'
import AllocationMonitor from './pages/AllocationMonitor'
import SystemSettings from './pages/SystemSettings'
import './App.css'

const { Content } = Layout

function App() {
  return (
    <Layout className="app-layout">
      <AppSidebar />
      <Layout>
        <AppHeader />
        <Content className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<LeadManagement />} />
            <Route path="/model" element={<ModelManagement />} />
            <Route path="/rules" element={<RuleConfiguration />} />
            <Route path="/analytics" element={<DataAnalytics />} />
            <Route path="/interaction" element={<CustomerInteraction />} />
            <Route path="/store" element={<StoreManagement />} />
            <Route path="/allocation" element={<AllocationMonitor />} />
            <Route path="/settings" element={<SystemSettings />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App