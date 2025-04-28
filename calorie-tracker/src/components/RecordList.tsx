import React from 'react';
import { List, SwipeAction } from 'antd-mobile';
import { DeleteOutline } from 'antd-mobile-icons';

interface FoodRecord {
  id: string;
  date: string;
  weight?: number;
  foodImage?: string;
  calories?: number;
  note?: string;
}

const RecordList: React.FC = () => {
  // 示例数据
  const records: FoodRecord[] = [
    {
      id: '1',
      date: '2025-04-17 12:00',
      weight: 70.5,
      calories: 500,
      note: '午餐：沙拉'
    }
  ];

  const handleDelete = (id: string) => {
    console.log('删除记录:', id);
  };

  return (
    <div className="record-list">
      <List header="记录列表">
        {records.map((record) => (
          <SwipeAction
            key={record.id}
            rightActions={[
              {
                key: 'delete',
                text: '删除',
                color: 'danger',
                onClick: () => handleDelete(record.id)
              }
            ]}
          >
            <List.Item
              title={record.date}
              description={record.note}
              extra={record.calories ? `${record.calories} 卡路里` : undefined}
            >
              {record.weight ? `体重: ${record.weight}kg` : ''}
            </List.Item>
          </SwipeAction>
        ))}
      </List>
    </div>
  );
};

export default RecordList;
