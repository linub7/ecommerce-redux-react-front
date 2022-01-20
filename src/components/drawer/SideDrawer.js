import React from 'react';
import { Drawer, Button } from 'antd';
import { Link } from 'react-router-dom';
import Laptop from '../../images/laptop.png';
import { useSelector, useDispatch } from 'react-redux';

const SideDrawer = () => {
  const cart = useSelector((state) => state.cart);
  const drawer = useSelector((state) => state.drawer);
  const dispatch = useDispatch();

  const imageStyle = {
    width: '100%',
    hegith: '3.125rem',
    objectFit: 'cover',
  };
  return (
    <Drawer
      className='text-center'
      title={`Cart / ${cart.length} Product`}
      placement='right'
      closable={false}
      onClose={() => {
        dispatch({
          type: 'SET_VISIBLE',
          payload: false,
        });
      }}
      visible={drawer}
    >
      {cart.map((product) => (
        <div key={product._id} className='row'>
          <div className='col'>
            {product.images[0] ? (
              <>
                <img
                  src={product.images[0].url}
                  style={imageStyle}
                  alt={product.title}
                />
                <p className='text-center bg-secondary text-light'>
                  {product.title}
                </p>
              </>
            ) : (
              <>
                <img src={Laptop} style={imageStyle} alt={product.title} />
                <p className='text-center bg-secondary text-light'>
                  {product.title}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
      <Link to='/cart'>
        <button
          onClick={() =>
            dispatch({
              type: 'SET_VISIBLE',
              payload: false,
            })
          }
          className='text-center btn btn-primary btn-raised btn-block'
        >
          Go to Cart
        </button>
      </Link>
    </Drawer>
  );
};

export default SideDrawer;
