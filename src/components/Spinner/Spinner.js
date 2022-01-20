import React from 'react';
import { Spin, Space } from 'antd';

const Spinner = () => {
  return (
    <Space
      size='middle'
      style={{ position: 'absolute', right: '50%', top: '-10%' }}
    >
      <Spin size='large' />
    </Space>
  );
};

export default Spinner;
