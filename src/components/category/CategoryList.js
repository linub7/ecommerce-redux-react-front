import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../functions/category';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((c) => {
        setCategories(c.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  }, []);

  const showCategories = () =>
    categories.map((category) => (
      <div
        key={category._id}
        className='col btn btn-outline-primary btn-large btn-block btn-raised m-3'
      >
        <Link to={`/category/${category.slug}`}>{category.name}</Link>
      </div>
    ));

  return (
    <div className='container'>
      <div className='row'>
        {loading ? (
          <h4 className='text-center'>Loading...</h4>
        ) : (
          showCategories()
        )}
      </div>
    </div>
  );
};

export default CategoryList;
