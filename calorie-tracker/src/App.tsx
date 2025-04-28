import React, { useState } from 'react';
import { TabBar } from 'antd-mobile';
import { CameraOutline, UnorderedListOutline, PieOutline } from 'antd-mobile-icons';
import CameraView from './components/CameraView';
import RecordList from './components/RecordList';
import StatsView from './components/StatsView';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('camera');

  const tabs = [
    {
      key: 'camera',
      title: '拍照记录',
      icon: <CameraOutline />
    },
    {
      key: 'list',
      title: '记录列表',
      icon: <UnorderedListOutline />
    },
    {
      key: 'stats',
      title: '数据统计',
      icon: <PieOutline />
    }
  ];

  return (
    <div className="app">
      <div className="content">
        {activeTab === 'camera' && <CameraView />}
        {activeTab === 'list' && <RecordList />}
        {activeTab === 'stats' && <StatsView />}
      </div>
      <TabBar activeKey={activeTab} onChange={setActiveTab}>
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </div>
  );
};

export default App;
