# 理想汽车事故线索智能分配平台

## 项目简介

理想汽车事故线索智能分配平台是一个基于React + TypeScript + Ant Design的现代化前端应用，旨在为理想汽车提供智能化的线索分配解决方案。该平台通过AI驱动的分配引擎，实现完全自动化的线索分配，确保客户体验最优、门店负载均衡、管理效率提升。

## 功能特性

### 🎯 核心功能
- **智能分配引擎**: 基于多因子模型的智能线索分配
- **实时监控**: 线索分配过程的实时监控和追踪
- **数据分析**: 多维度数据分析和可视化展示
- **模型管理**: 分配模型的创建、配置、测试和版本管理
- **门店管理**: 门店信息管理和绩效监控
- **地图可视化**: 基于地图的线索和门店分布展示

### 📊 业务价值
- **提升客户体验**: 通过智能分配，确保客户就近、高效获得服务
- **优化网络运营**: 实现门店负载均衡，资源利用率提升40%+
- **强化管理抓手**: 通过线索分配机制引导门店提升服务质量
- **降低运营成本**: 减少人工干预，提高处理效率
- **支持网络扩张**: 为未来授权店模式提供标准化分配机制

## 技术栈

- **前端框架**: React 18 + TypeScript
- **状态管理**: Redux Toolkit + RTK Query
- **UI组件库**: Ant Design 5.x
- **图表库**: ECharts 5.x
- **地图组件**: 高德地图 API (可配置)
- **路由**: React Router 6
- **样式**: Styled Components + CSS Modules
- **构建工具**: Vite
- **代码规范**: ESLint + Prettier

## 项目结构

```
src/
├── components/          # 通用组件
│   ├── common/         # 基础组件
│   ├── charts/         # 图表组件
│   ├── map/           # 地图组件
│   └── forms/         # 表单组件
├── pages/             # 页面组件
│   ├── Dashboard/     # 仪表盘
│   ├── ModelManagement/ # 模型管理
│   ├── DataAnalytics/ # 数据分析
│   ├── StoreManagement/ # 门店管理
│   ├── AllocationMonitor/ # 分配监控
│   └── SystemSettings/ # 系统设置
├── services/          # API服务
├── store/             # 状态管理
├── types/             # 类型定义
├── utils/             # 工具函数
├── assets/            # 静态资源
└── styles/            # 样式文件
```

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览生产版本
```bash
npm run preview
# 或
yarn preview
```

## 主要页面

### 1. 仪表盘 (Dashboard)
- 关键指标展示
- 实时数据监控
- 趋势图表分析
- 地图可视化

### 2. 模型管理 (Model Management)
- 模型创建和配置
- 参数调整和优化
- 模型测试和验证
- 版本管理

### 3. 数据分析 (Data Analytics)
- 多维度数据分析
- 图表可视化
- 报表生成
- 趋势预测

### 4. 分配监控 (Allocation Monitor)
- 实时分配监控
- 分配结果展示
- 异常处理
- 历史记录查询

### 5. 门店管理 (Store Management)
- 门店信息管理
- 绩效监控
- 负载分析
- 联系方式管理

### 6. 系统设置 (System Settings)
- 通用设置
- 分配设置
- 通知设置
- 安全设置

## 核心特性

### 智能分配算法
- **距离因子**: 基于客户位置和门店位置的距离计算
- **绩效因子**: 基于门店历史服务评分的绩效评估
- **配额因子**: 基于门店当前负载和配额的均衡分配
- **权重配置**: 支持灵活的因子权重配置

### 实时监控
- **分配过程**: 实时展示线索分配的计算过程
- **状态跟踪**: 线索从创建到完成的全程状态跟踪
- **异常处理**: 自动识别和处理分配异常情况
- **性能监控**: 系统性能和分配效果的实时监控

### 数据可视化
- **图表展示**: 基于ECharts的丰富图表展示
- **地图集成**: 集成高德地图API的地图可视化
- **交互式分析**: 支持多维度数据筛选和钻取
- **实时更新**: 数据的实时更新和刷新

## 开发指南

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint和Prettier代码规范
- 组件采用函数式组件和Hooks
- 使用Redux Toolkit进行状态管理

### 组件开发
- 组件应该具有良好的可复用性
- 使用TypeScript定义组件Props类型
- 遵循单一职责原则
- 添加适当的注释和文档

### 样式规范
- 使用CSS Modules或Styled Components
- 遵循BEM命名规范
- 支持响应式设计
- 保持设计一致性

## 部署说明

### 开发环境
- 使用Vite开发服务器
- 支持热重载和快速构建
- 集成ESLint和Prettier

### 生产环境
- 使用Vite构建生产版本
- 支持代码分割和懒加载
- 优化打包体积和性能

### 环境配置
- 开发环境: `npm run dev`
- 生产构建: `npm run build`
- 预览构建: `npm run preview`

## 浏览器支持

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目维护者: 理想汽车技术团队
- 邮箱: tech@lixiang.com
- 项目地址: https://github.com/ideal-car/accident-platform

## 更新日志

### v1.0.0 (2024-10-15)
- 初始版本发布
- 实现核心功能模块
- 完成基础UI界面
- 集成图表和地图组件
- 添加模拟数据服务

---

**注意**: 这是一个演示项目，用于展示理想汽车事故线索智能分配平台的前端实现。实际生产环境需要集成真实的后端API和地图服务。