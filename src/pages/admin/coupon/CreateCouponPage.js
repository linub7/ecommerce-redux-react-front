import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  getCoupons,
  createCoupon,
  removeCoupon,
} from '../../../functions/coupon';
import { DeleteOutlined } from '@ant-design/icons';
import AdminNav from '../../../components/nav/AdminNav';

const CreateCouponPage = () => {
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [discount, setDiscount] = useState('');
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    getCoupons().then((response) => {
      setCoupons(response.data);
    });
  }, []);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    createCoupon({ name, expiry, discount }, user.token)
      .then((response) => {
        setLoading(false);
        getCoupons().then((res) => setCoupons(res.data));
        setName('');
        setDiscount('');
        setExpiry('');
        toast.success(`${response.data.name} is created`);
      })
      .catch((error) => console.log(error));
  };

  const handleRemove = (id) => {
    if (window.confirm('Delete?')) {
      setLoading(true);
      removeCoupon(id, user.token)
        .then((res) => {
          getCoupons().then((res) => setCoupons(res.data));
          setLoading(false);
          toast.error(`Coupon ${res.data.name} Deleted!`);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col-md-10'>
          {loading ? (
            <h4 className='text-danger'>Loading...</h4>
          ) : (
            <h4>Coupon</h4>
          )}
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label className='text-muted'>Name</label>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                autoFocus
              />
            </div>
            <div className='form-group'>
              <label className='text-muted'>Discount %</label>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                required
              />
            </div>
            <div className='form-group'>
              <label className='text-muted'>Expiry</label>
              <br />
              <DatePicker
                className='form-control'
                selected={new Date()}
                value={expiry}
                required
                onChange={(date) => setExpiry(date)}
              />
            </div>
            <button className='btn btn-outline-primary'>Save</button>
          </form>

          <br />

          <h4>{coupons.length} Coupons</h4>
          <table className='table table-bordered'>
            <thead className='thead-light'>
              <tr>
                <th scope='col'>Name</th>
                <th scope='col'>Expiry</th>
                <th scope='col'>Discount</th>
                <th scope='col'>Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>{coupon.name}</td>
                  <td>{new Date(coupon.expiry).toLocaleDateString()}</td>
                  <td className='text-center'>{coupon.discount}%</td>
                  <td className='text-center text-danger'>
                    <DeleteOutlined
                      className='pointer'
                      onClick={() => handleRemove(coupon._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateCouponPage;
