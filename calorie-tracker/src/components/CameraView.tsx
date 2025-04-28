import React from 'react';
import { Button, ImageUploader, Form, Input } from 'antd-mobile';

const CameraView: React.FC = () => {
  return (
    <div className="camera-view">
      <Form layout="horizontal">
        <Form.Header>记录食物和体重</Form.Header>
        <Form.Item label="体重" name="weight">
          <Input type="number" placeholder="输入体重(kg)" />
        </Form.Item>
        <Form.Item label="食物照片" name="foodImage">
          <ImageUploader
            maxCount={1}
            upload={async (file) => {
              // TODO: 实现图片上传和食物识别
              return {
                url: URL.createObjectURL(file)
              };
            }}
          />
        </Form.Item>
        <Form.Item label="备注" name="note">
          <Input placeholder="添加备注" />
        </Form.Item>
      </Form>
      <Button block color="primary" size="large" style={{ marginTop: '16px' }}>
        保存记录
      </Button>
    </div>
  );
};

export default CameraView;
