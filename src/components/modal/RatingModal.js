import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { toast } from 'react-toastify';
import { StarOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

const RatingModal = ({ children }) => {
  const user = useSelector((state) => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const history = useHistory();
  const { slug } = useParams();

  const handleClick = () => {
    if (user && user.token) {
      setModalVisible(true);
    } else {
      history.push({
        pathname: '/login',
        state: { from: `/product/${slug}` },
      });
    }
  };
  return (
    <>
      <div onClick={handleClick}>
        <StarOutlined className='text-danger' />
        <br />
        {user ? 'Leave rating' : 'Login to leave rating'}
      </div>
      <Modal
        title='Leave Your Rating'
        centered
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
          toast.success('Thanks for your rating.It will appear soon');
        }}
        onCancel={() => setModalVisible(false)}
      >
        {children}
      </Modal>
    </>
  );
};

export default RatingModal;
