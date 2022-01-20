import React from 'react';
import Jumbotron from '../components/cards/Jumbotron';
import CategoryList from '../components/category/CategoryList';
import BestSellers from '../components/home/BestSellers';
import NewArrivals from '../components/home/NewArrivals';
import SubList from '../components/sub/SubList';

const Home = () => {
  return (
    <>
      <div className='jumbotron text-danger h1 font-weight-bold text-center'>
        <Jumbotron text={['Latest Products', 'New Arrivals', 'Best Sellers']} />
      </div>
      <div className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
        New Arrivals
      </div>
      <NewArrivals />
      <br />
      <br />
      <div className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
        Best Sellers
      </div>
      <BestSellers />

      <div className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
        Categories
      </div>
      <CategoryList />

      <div className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
        Sub Categories
      </div>
      <SubList />
      <br />
      <br />
    </>
  );
};

export default Home;
