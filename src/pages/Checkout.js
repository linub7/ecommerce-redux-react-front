import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrder,
} from '../functions/user';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Checkout = ({ history }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState('');
  const [coupon, setCoupon] = useState('');
  const [addressSaved, setAddressSaved] = useState(false);
  //discount price
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState('');

  // redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const cashOnDelivery = useSelector((state) => state.cashOnDelivery);
  const couponApplied = useSelector((state) => state.coupon);

  useEffect(() => {
    getUserCart(user.token)
      .then((response) => {
        console.log(
          'USER CART RESPONSE',
          JSON.stringify(response.data, null, 4)
        );
        setProducts(response.data.products);
        setTotal(response.data.cartTotal);
      })
      .catch((error) => console.log(error));
  }, [user.token]);

  const saveAddressToDb = () => {
    saveUserAddress(user.token, address)
      .then((response) => {
        if (response.data.ok) {
          setAddressSaved(true);
          toast.success('Address Saved');
        }
      })
      .catch((error) => console.log(error));
  };

  const applyDiscountCoupon = () => {
    applyCoupon(user.token, coupon)
      .then((response) => {
        console.log('RESPONSE ON COUPON APPLIED', response.data);
        if (response.data) {
          setTotalAfterDiscount(response.data);
          // update redux coupon applied
          dispatch({
            type: 'COUPON_APPLIED',
            payload: true,
          });
        }
        if (response.data.err) {
          setDiscountError(response.data.err);
          // update redux coupon applied
          dispatch({
            type: 'COUPON_APPLIED',
            payload: false,
          });
        }
      })
      .catch();
  };

  const emptyCart = () => {
    // remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }

    // remove from redux
    dispatch({
      type: 'ADD_TO_CART',
      payload: [],
    });

    // remove from backend
    emptyUserCart(user.token)
      .then((response) => {
        setProducts([]);
        setTotal(0);
        setTotalAfterDiscount(0);
        setCoupon('');
        toast.success('Cart is Empty. Continue Shopping.');
      })
      .catch((error) => console.log(error));
  };

  const createCashOnDeliveryOrder = () => {
    createCashOrder(user.token, cashOnDelivery, couponApplied)
      .then((response) => {
        console.log('CREATE CASH ORDER RES: ', response);
        // empty cart from redux, local storage, reset coupon, reset CASH_ON_DELIVERY, empty user cart from backend,redirect
        if (response.data.ok) {
          dispatch({ type: 'ADD_TO_CART', payload: [] });
          if (typeof window !== 'undefined') localStorage.removeItem('cart');
          dispatch({ type: 'COUPON_APPLIED', payload: false });
          dispatch({ type: 'CASH_ON_DELIVERY', payload: false });
          emptyUserCart(user.token);
          setTimeout(() => {
            history.push('/user/history');
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
        Save
      </button>
    </>
  );

  const showProductSummary = () =>
    products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) x {p.count} ={' '}
          {p.product.price * p.count}
        </p>
      </div>
    ));

  const showApplyCoupon = () => (
    <>
      <input
        value={coupon}
        type="text"
        className="form-control"
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError('');
        }}
      />
      <button className="btn btn-primary mt-2" onClick={applyDiscountCoupon}>
        Apply
      </button>
    </>
  );

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {discountError && <p className="bg-danger p-2">{discountError}</p>}
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length}</p>
        <hr />
        {showProductSummary()}
        <hr />
        <p>Cart total: ${total}</p>
        {totalAfterDiscount > 0 && (
          <p className="bg-success p-2">
            Discount Applied: ${totalAfterDiscount}
          </p>
        )}

        <div className="row">
          <div className="col-md-6">
            {cashOnDelivery ? (
              <button
                disabled={!products.length || !addressSaved}
                className="btn btn-primary"
                onClick={createCashOnDeliveryOrder}
              >
                Place Order
              </button>
            ) : (
              <button
                disabled={!products.length || !addressSaved}
                className="btn btn-primary"
                onClick={() => history.push('/payment')}
              >
                Place Order
              </button>
            )}
          </div>

          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={emptyCart}
              className="btn btn-primary"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
