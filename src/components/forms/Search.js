import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

const Search = () => {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search);
  const { text } = search;
  const history = useHistory();

  const handleChange = (e) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: e.target.value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/shop?${text}`);
  };
  return (
    <form
      className='form-inline my-2 my-lg-0'
      style={{ position: 'absolute', right: '40%' }}
      onSubmit={handleSubmit}
    >
      <input
        type='search'
        value={text}
        className='form-control mr-sm-2'
        placeholder='Search'
        onChange={handleChange}
      />
      <SearchOutlined onClick={handleSubmit} style={{ cursor: 'pointer' }} />
    </form>
  );
};

export default Search;
