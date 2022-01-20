import React from 'react';

const LocalSearch = ({ keyword, setKeyword }) => {
  // step 3
  const handleSearchChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };
  return (
    <div className='container pt-4 pb-4'>
      <input
        type='text'
        className='form-control mb-4'
        placeholder='Filter'
        value={keyword}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default LocalSearch;
