import React, { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { getCategories } from '../../../functions/category';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Spinner from '../../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';
import { createSub, removeSub, getSubs } from '../../../functions/sub';

const SubCreate = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subs, setSubs] = useState([]);
  const [category, setCategory] = useState('');

  // step 1
  const [keyword, setKeyword] = useState('');

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCategories();
    loadSubs();
  }, []);

  const loadCategories = () =>
    getCategories()
      .then((categories) => setCategories(categories.data))
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });

  const loadSubs = () =>
    getSubs()
      .then((subs) => setSubs(subs.data))
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    createSub({ name, parent: category }, user.token)
      .then((response) => {
        setLoading(false);
        setName('');
        toast.success(`${response.data.name} Created`);
        loadSubs();
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
      removeSub(slug, user.token)
        .then((response) => {
          setLoading(false);
          loadSubs();
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
          {loading ? <Spinner /> : <h4>Create Sub Category</h4>}
          <div className='form-group'>
            <label>Parent Category: </label>
            <select
              name='category'
              className='custom-select'
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Please Select a Category</option>
              {categories.length > 0 &&
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
          <br />
          {/* step 2 and 3 */}
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          {/* step 5 */}
          {subs.filter(searched(keyword)).map((sub) => (
            <div className='alert alert-secondary' key={sub._id}>
              {sub.name}{' '}
              <span
                onClick={() => handleRemove(sub.slug)}
                className='btn btn-sm float-right'
              >
                <DeleteOutlined className='text-danger' />
              </span>{' '}
              <Link to={`/admin/sub/${sub.slug}`}>
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

export default SubCreate;
