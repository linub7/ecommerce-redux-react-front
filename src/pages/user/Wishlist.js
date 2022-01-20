import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNav from '../../components/nav/UserNav';
import { getWishlist, removeWishlist } from '../../functions/user';
import { DeleteOutlined } from '@ant-design/icons';

const Wishlist = () => {
  const [wishlists, setWishlists] = useState([]);
  const user = useSelector((state) => state.user);

  const loadWishlistsProducts = () => {
    getWishlist(user.token)
      .then((response) => {
        console.log('WISHLISTS: ', response.data);
        setWishlists(response.data.wishlist);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadWishlistsProducts();
  }, []);

  const handleRemoveFromWishlist = (productId) => {
    removeWishlist(productId, user.token)
      .then((response) => {
        console.log('REMOVE WISHLIST RES: ', response.data);
        toast.success('Product Removed from Wishlist Successfully.');
        loadWishlistsProducts();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>Wishlists</h4>
          {wishlists &&
            wishlists.map((product) => (
              <div className="alert alert-secondary" key={product._id}>
                <Link to={`/product/${product.slug}`}>{product.title}</Link>
                <span
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="btn btn-sm float-right"
                >
                  <DeleteOutlined className="text-danger" />
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
