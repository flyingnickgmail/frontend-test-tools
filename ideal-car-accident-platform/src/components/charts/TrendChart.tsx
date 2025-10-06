import React from 'react'
import ReactECharts from 'echarts-for-react'
import { TrendData } from '../../types'

interface TrendChartProps {
  data: TrendData[]
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const option = {
    title: {
      text: '线索分配趋势',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['总线索数', '已分配', '处理中', '已完成'],
      top: 30,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.date),
    },
    yAxis: {
      type: 'value',
      name: '线索数量',
    },
    series: [
      {
        name: '总线索数',
        type: 'line',
        data: data.map((item: TrendData) => item.value),
        smooth: true,
        lineStyle: {
          color: '#1890ff',
          width: 3,
        },
        itemStyle: {
          color: '#1890ff',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
            ],
          },
        },
      },
      {
        name: '已分配',
        type: 'line',
        data: data.map((item: TrendData) => item.value * 0.8),
        smooth: true,
        lineStyle: {
          color: '#52c41a',
          width: 2,
        },
        itemStyle: {
          color: '#52c41a',
        },
      },
      {
        name: '处理中',
        type: 'line',
        data: data.map((item: TrendData) => item.value * 0.3),
        smooth: true,
        lineStyle: {
          color: '#faad14',
          width: 2,
        },
        itemStyle: {
          color: '#faad14',
        },
      },
      {
        name: '已完成',
        type: 'line',
        data: data.map((item: TrendData) => item.value * 0.6),
        smooth: true,
        lineStyle: {
          color: '#13c2c2',
          width: 2,
        },
        itemStyle: {
          color: '#13c2c2',
        },
      },
    ],
  }

  return (
    <div className="chart-container">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

export default TrendChart