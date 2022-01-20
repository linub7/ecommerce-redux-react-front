import React, { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import {
  createCategory,
  getCategories,
  removeCategory,
} from '../../../functions/category';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Spinner from '../../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';

const CategoryCreate = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // step 1
  const [keyword, setKeyword] = useState('');

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () =>
    getCategories()
      .then((categories) => setCategories(categories.data))
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    createCategory({ name }, user.token)
      .then((response) => {
        setLoading(false);
        setName('');
        toast.success(`${response.data.name} Created`);
        loadCategories();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response.status === 400) toast.error(error.response.data);
      });
  };

  const handleRemove = async (slug) => {
    if (window.confirm('Are You Sure?')) {
      setLoading(true);
      removeCategory(slug, user.token)
        .then((response) => {
          setLoading(false);
          loadCategories();
          toast.error(`${slug} Deleted`);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          if (error.response.status === 400) toast.error(error.response.data);
        });
    }
  };

  // step 4
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-3'>
          <AdminNav />
        </div>
        <div className='col'>
          {loading ? <Spinner /> : <h4>Create Category</h4>}
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
          <br />
          {/* step 2 and 3 */}
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />
          <h4>Categories: </h4>
          {/* step 5 */}
          {categories.filter(searched(keyword)).map((category) => (
            <div className='alert alert-secondary' key={category._id}>
              {category.name}{' '}
              <span
                onClick={() => handleRemove(category.slug)}
                className='btn btn-sm float-right'
              >
                <DeleteOutlined className='text-danger' />
              </span>{' '}
              <Link to={`/admin/category/${category.slug}`}>
                <span className='btn btn-sm float-right'>
                  <EditOutlined className='text-warning' />
                </span>{' '}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
