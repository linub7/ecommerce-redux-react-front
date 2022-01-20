import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/cards/ProductCard';
import { getCategory } from '../../functions/category';

const CategoryHome = ({ match }) => {
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = match.params;

  useEffect(() => {
    setLoading(true);
    getCategory(slug)
      .then((category) => {
        setLoading(false);
        setCategory(category.data.category);
        setProducts(category.data.products);
      })
      .catch((error) => console.log(error));
  }, [slug]);

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col'>
          {loading ? (
            <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
              Loading...
            </h4>
          ) : (
            <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
              {products.length} Products in "{category.name}" Category
            </h4>
          )}
        </div>
      </div>

      <div className='row'>
        {products.map((product) => (
          <div className='col-md-4' key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryHome;
