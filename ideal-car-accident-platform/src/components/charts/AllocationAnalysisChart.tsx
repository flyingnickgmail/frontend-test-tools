import React from 'react'
import ReactECharts from 'echarts-for-react'

const AllocationAnalysisChart: React.FC = () => {
  // 模拟数据
  const allocationData = [
    { name: '距离因子', value: 35 },
    { name: '绩效因子', value: 30 },
    { name: '配额因子', value: 20 },
    { name: '其他因子', value: 15 },
  ]

  const timeDistribution = [
    { time: '00:00', count: 2 },
    { time: '02:00', count: 1 },
    { time: '04:00', count: 0 },
    { time: '06:00', count: 3 },
    { time: '08:00', count: 15 },
    { time: '10:00', count: 25 },
    { time: '12:00', count: 30 },
    { time: '14:00', count: 28 },
    { time: '16:00', count: 35 },
    { time: '18:00', count: 40 },
    { time: '20:00', count: 20 },
    { time: '22:00', count: 8 },
  ]

  const regionDistribution = [
    { name: '华东区域', value: 45 },
    { name: '华北区域', value: 25 },
    { name: '华南区域', value: 20 },
    { name: '华西区域', value: 10 },
  ]

  const option = {
    title: {
      text: '分配效果分析',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
    },
    series: [
      {
        name: '分配因子权重',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['25%', '50%'],
        data: allocationData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: {
          show: true,
          formatter: '{b}: {c}%',
        },
      },
      {
        name: '时段分布',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: timeDistribution.map(item => item.count),
        itemStyle: {
          color: '#1890ff',
        },
      },
      {
        name: '区域分布',
        type: 'pie',
        radius: '30%',
        center: ['75%', '30%'],
        data: regionDistribution,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: {
          show: true,
          formatter: '{b}: {c}%',
        },
      },
    ],
    xAxis: [
      {
        type: 'category',
        data: timeDistribution.map(item => item.time),
        gridIndex: 1,
        axisLabel: {
          rotate: 45,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        gridIndex: 1,
        name: '线索数量',
      },
    ],
    grid: [
      {
        left: '50%',
        right: '5%',
        top: '60%',
        height: '35%',
      },
    ],
  }

  return (
    <div className="chart-container">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

export default AllocationAnalysisChart