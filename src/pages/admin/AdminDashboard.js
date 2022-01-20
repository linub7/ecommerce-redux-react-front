import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/nav/AdminNav';
import { getOrders, changeStatus } from '../../functions/admin';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Orders from '../../components/order/Orders';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllOrders = () =>
    getOrders(user.token).then((response) => {
      console.log(JSON.stringify(response.data, null, 4));
      setOrders(response.data);
    });

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token).then((response) => {
      toast.success('Status Updated');
      loadAllOrders();
    });
  };
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col-md-10'>
          <h4>Admin Dashboard</h4>
          <Orders orders={orders} handleStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
