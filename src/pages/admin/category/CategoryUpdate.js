import React, { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { getCategory, updateCategory } from '../../../functions/category';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Spinner from '../../../components/Spinner/Spinner';
import CategoryForm from '../../../components/forms/CategoryForm';

const CategoryUpdate = ({ history, match }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCategory = () =>
    getCategory(match.params.slug)
      .then((category) => setName(category.data.name))
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    updateCategory(match.params.slug, { name }, user.token)
      .then((response) => {
        setLoading(false);
        setName('');
        toast.success(`${response.data.name} Updated`);
        history.push('/admin/category');
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response.status === 400) toast.error(error.response.data);
      });
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-3'>
          <AdminNav />
        </div>
        <div className='col'>
          {loading ? <Spinner /> : <h4>Update Category</h4>}
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate;
