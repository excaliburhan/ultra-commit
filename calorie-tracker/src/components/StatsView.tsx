import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card } from 'antd-mobile';

const StatsView: React.FC = () => {
  // 示例数据
  const weightData = {
    dates: ['4-10', '4-11', '4-12', '4-13', '4-14', '4-15', '4-16'],
    weights: [70.5, 70.3, 70.2, 70.0, 69.8, 69.7, 69.5]
  };

  const caloriesData = {
    dates: ['4-10', '4-11', '4-12', '4-13', '4-14', '4-15', '4-16'],
    calories: [2100, 1950, 2000, 1850, 1900, 1800, 1750]
  };

  const weightOption = {
    title: {
      text: '体重趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: weightData.dates
    },
    yAxis: {
      type: 'value',
      name: '体重(kg)'
    },
    series: [
      {
        data: weightData.weights,
        type: 'line',
        smooth: true
      }
    ]
  };

  const caloriesOption = {
    title: {
      text: '卡路里摄入趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: caloriesData.dates
    },
    yAxis: {
      type: 'value',
      name: '卡路里(kcal)'
    },
    series: [
      {
        data: caloriesData.calories,
        type: 'line',
        smooth: true,
        areaStyle: {}
      }
    ]
  };

  return (
    <div className="stats-view">
      <Card title="数据统计">
        <div style={{ marginBottom: '20px' }}>
          <ReactECharts option={weightOption} style={{ height: '300px' }} />
        </div>
        <div>
          <ReactECharts option={caloriesOption} style={{ height: '300px' }} />
        </div>
      </Card>
    </div>
  );
};

export default StatsView;
