import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const ProductUpdateForm = ({
  handleSubmit,
  handleChange,
  values,
  handleCatagoryChange,
  categories,
  setValues,
  subOptions,
  arrayOfSubIds,
  setArrayOfSubIds,
  selectedCategory,
}) => {
  // destructure
  const {
    title,
    description,
    price,
    category,
    subs,
    shipping,
    quantity,
    images,
    colors,
    brands,
    color,
    brand,
  } = values;

  return (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label>Title</label>
        <input
          type='text'
          name='title'
          className='form-control'
          value={title}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label>Description</label>
        <input
          type='text'
          name='description'
          className='form-control'
          value={description}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label>Price</label>
        <input
          type='number'
          name='price'
          className='form-control'
          value={price}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label>Shipping</label>
        <select
          value={shipping === 'Yes' ? 'Yes' : 'No'}
          name='shipping'
          className='custom-select'
          onChange={handleChange}
        >
          <option value='No'>No</option>
          <option value='Yes'>Yes</option>
        </select>
      </div>

      <div className='form-group'>
        <label>Quantity</label>
        <input
          type='number'
          name='quantity'
          className='form-control'
          value={quantity}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label>Color</label>
        <select
          name='color'
          className='custom-select'
          onChange={handleChange}
          value={color}
        >
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className='form-group'>
        <label>Brand</label>
        <select
          name='brand'
          className='custom-select'
          onChange={handleChange}
          value={brand}
        >
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className='form-group'>
        <label>Category</label>
        <select
          name='category'
          className='custom-select'
          onChange={handleCatagoryChange}
          value={selectedCategory ? selectedCategory : category._id}
        >
          {categories.length > 0 &&
            categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label>Sub Categories</label>
        <Select
          mode='multiple'
          allowClear
          style={{ width: '100%' }}
          placeholder='Please Select'
          value={arrayOfSubIds}
          onChange={(value) => setArrayOfSubIds(value)}
        >
          {subOptions.length &&
            subOptions.map((subOption) => (
              <Option key={subOption._id} value={subOption._id}>
                {subOption.name}
              </Option>
            ))}
        </Select>
      </div>

      <br />
      <button className='btn btn-outline-info'>Save</button>
    </form>
  );
};

export default ProductUpdateForm;
