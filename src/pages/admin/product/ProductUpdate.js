import React, { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getProduct, updateProduct } from '../../../functions/product';
import { getCategories, getCategorySubs } from '../../../functions/category';
import FileUpload from '../../../components/forms/FileUpload';
import { LoadingOutlined } from '@ant-design/icons';
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm';

const initialState = {
  title: '',
  description: '',
  price: '',

  category: '',
  subs: [],
  shipping: '',
  quantity: '',
  images: [],
  colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
  brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
  color: '',
  brand: '',
};

const ProductUpdate = ({ match, history }) => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [arrayOfSubIds, setArrayOfSubIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  // redux
  const { user } = useSelector((state) => ({ ...state }));

  const { slug } = match.params;

  useEffect(() => {
    loadProduct();
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProduct = () => {
    getProduct(slug)
      .then((response) => {
        //1. load single product
        setValues({ ...values, ...response.data });
        //2. load single product category subs
        getCategorySubs(response.data.category._id)
          .then((res) => {
            setSubOptions(res.data); // on first load show default subs
          })
          .catch((err) => console.log(err));
        //3. prepare array of sub Ids to show as default sub values in ant design select
        let arr = [];
        response.data.subs.map((sub) => {
          return arr.push(sub._id);
        });
        console.log('ARRAY: ', arr);
        setArrayOfSubIds((prev) => arr); // required for ant design select to work
      })
      .catch((error) => console.log(error));
  };

  const loadCategories = () => {
    getCategories().then((c) => setCategories(c.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    values.subs = arrayOfSubIds;
    values.category = selectedCategory ? selectedCategory : values.category;

    updateProduct(slug, values, user.token)
      .then((response) => {
        setLoading(false);
        toast.success(`${response.data.title} is updated!`);
        history.push('/admin/products');
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error(error.response.data.err);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    // console.log(e.target.name, " ----- ", e.target.value);
  };

  const handleCatagoryChange = (e) => {
    e.preventDefault();
    console.log('CLICKED CATEGORY', e.target.value);
    setValues({ ...values, subs: [] });
    setSelectedCategory(e.target.value);
    getCategorySubs(e.target.value)
      .then((res) => {
        console.log('SUB OPTIONS ON CATGORY CLICK', res);
        setSubOptions(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    console.log('EXISTING CATEGORY', values.category);

    // if user clicks back to the original category
    // show its sub category in default
    if (values.category._id === e.target.value) {
      loadProduct();
    }
    // clear old sub category Ids
    setArrayOfSubIds([]);
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-3'>
          <AdminNav />
        </div>

        <div className='col-md-9'>
          {loading ? (
            <LoadingOutlined className='text-danger h3' />
          ) : (
            <h4>Product Update</h4>
          )}
          <br />
          <div className='p-3'>
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues}
            handleCatagoryChange={handleCatagoryChange}
            categories={categories}
            subOptions={subOptions}
            values={values}
            arrayOfSubIds={arrayOfSubIds}
            setArrayOfSubIds={setArrayOfSubIds}
            selectedCategory={selectedCategory}
          />
          <br />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
