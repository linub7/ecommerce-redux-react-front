import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../components/cards/ProductCard';
import SingleProduct from '../components/cards/SingleProduct';
import { getProduct, getRelated, productStar } from '../functions/product';

const Product = ({ match }) => {
  const [product, setProduct] = useState({});
  const [star, setStar] = useState(0);
  const [related, setRelated] = useState([]);

  // redux
  const user = useSelector((state) => state.user);

  const { slug } = match.params;

  useEffect(() => {
    loadSingleProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );
      existingRatingObject && setStar(existingRatingObject.star); // current user star
    }
  }, [product.ratings, user]);

  const loadSingleProduct = () => {
    getProduct(slug)
      .then((response) => {
        setProduct(response.data);
        // load related
        getRelated(response.data._id)
          .then((res) => setRelated(res.data))
          .catch((err) => console.log(err));
      })
      .catch((error) => console.log(error));
  };

  const onStarClick = (newRating, name) => {
    setStar(newRating);
    console.table(newRating, name);
    productStar(name, newRating, user.token)
      .then((response) => {
        console.log('rating clicked: ', response.data);
        loadSingleProduct(); // if you want to show updated rating in real time
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='container-fluid'>
      <div className='row pt-4'>
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
        />
      </div>
      <div className='row'>
        <div className='col text-center pt-5 pb-5'>
          <hr />
          <h4>Related Products</h4>
          <hr />
        </div>
      </div>
      <div className='row pb-5'>
        {related.length ? (
          related.map((relatedProduct) => (
            <div key={relatedProduct._id} className='col-md-4'>
              <ProductCard product={relatedProduct} />
            </div>
          ))
        ) : (
          <div className='text-center col'>No Product Found</div>
        )}
      </div>
    </div>
  );
};

export default Product;
