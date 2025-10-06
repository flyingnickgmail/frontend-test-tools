import React from 'react'
import ReactECharts from 'echarts-for-react'
import { StorePerformance } from '../../types'

interface StorePerformanceChartProps {
  data: StorePerformance[]
}

const StorePerformanceChart: React.FC<StorePerformanceChartProps> = ({ data }) => {
  const option = {
    title: {
      text: '门店绩效排名',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        const data = params[0]
        return `
          <div>
            <div><strong>${data.name}</strong></div>
            <div>线索数量: ${data.value[0]}</div>
            <div>完成率: ${data.value[1]}%</div>
            <div>平均处理时间: ${data.value[2]}分钟</div>
            <div>客户满意度: ${data.value[3]}分</div>
            <div>负载率: ${data.value[4]}%</div>
          </div>
        `
      },
    },
    legend: {
      data: ['线索数量', '完成率', '平均处理时间', '客户满意度', '负载率'],
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
        data: data.map((item: StorePerformance) => item.storeName),
      axisLabel: {
        rotate: 45,
        fontSize: 10,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '线索数量',
        position: 'left',
        axisLabel: {
          formatter: '{value}',
        },
      },
      {
        type: 'value',
        name: '完成率/满意度',
        position: 'right',
        axisLabel: {
          formatter: '{value}%',
        },
      },
    ],
    series: [
      {
        name: '线索数量',
        type: 'bar',
        data: data.map((item: StorePerformance) => item.leadsCount),
        itemStyle: {
          color: '#1890ff',
        },
      },
      {
        name: '完成率',
        type: 'line',
        yAxisIndex: 1,
        data: data.map((item: StorePerformance) => item.completionRate),
        lineStyle: {
          color: '#52c41a',
          width: 3,
        },
        itemStyle: {
          color: '#52c41a',
        },
      },
      {
        name: '平均处理时间',
        type: 'line',
        data: data.map((item: StorePerformance) => item.averageProcessingTime),
        lineStyle: {
          color: '#faad14',
          width: 2,
        },
        itemStyle: {
          color: '#faad14',
        },
      },
      {
        name: '客户满意度',
        type: 'line',
        yAxisIndex: 1,
        data: data.map((item: StorePerformance) => item.customerSatisfaction),
        lineStyle: {
          color: '#13c2c2',
          width: 2,
        },
        itemStyle: {
          color: '#13c2c2',
        },
      },
      {
        name: '负载率',
        type: 'line',
        data: data.map((item: StorePerformance) => item.loadRate),
        lineStyle: {
          color: '#f5222d',
          width: 2,
        },
        itemStyle: {
          color: '#f5222d',
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

export default StorePerformanceChart