import { LoadingOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminProductCard from '../../../components/cards/AdminProductCard';
import AdminNav from '../../../components/nav/AdminNav';
import { getProductsByCount, removeProduct } from '../../../functions/product';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(100)
      .then((response) => {
        setLoading(false);
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleRemove = (slug) => {
    const answer = window.confirm('Are you sure?');
    if (answer) {
      removeProduct(slug, user.token)
        .then((response) => {
          loadAllProducts();
          toast.error(`${response.data.title} is Deleted`);
        })
        .catch((error) => {
          if (error.response.status === 400) toast.error(error.response.data);
          console.log(error);
        });
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col'>
          {loading ? (
            <LoadingOutlined
              className='text-danger h3'
              style={{ position: 'absolute', top: '50%', right: '50%' }}
            />
          ) : (
            <>
              <h4>All Products</h4>
              <div className='row'>
                {products.map((product) => (
                  <div key={product._id} className='col-md-4 pb-3'>
                    <AdminProductCard
                      product={product}
                      handleRemove={handleRemove}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
