import React, { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { getCategories } from '../../../functions/category';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Spinner from '../../../components/Spinner/Spinner';
import CategoryForm from '../../../components/forms/CategoryForm';
import { getSub, updateSub } from '../../../functions/sub';

const SubUpdate = ({ match, history }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [parent, setParent] = useState('');

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCategories();
    loadSub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCategories = () =>
    getCategories()
      .then((categories) => setCategories(categories.data))
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });

  const loadSub = () =>
    getSub(match.params.slug)
      .then((sub) => {
        setName(sub.data.name);
        setParent(sub.data.parent);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    updateSub(match.params.slug, { name, parent }, user.token)
      .then((response) => {
        setLoading(false);
        setName('');
        toast.success(`${response.data.name} Updated!`);
        history.push('/admin/sub');
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
          {loading ? <Spinner /> : <h4>Update Sub Category</h4>}
          <div className='form-group'>
            <label>Parent Category: </label>
            <select
              name='category'
              className='custom-select'
              onChange={(e) => setParent(e.target.value)}
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
        </div>
      </div>
    </div>
  );
};

export default SubUpdate;
