import React from 'react';

import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import LoadingToRedirect from './LoadingToRedirect';
import Spinner from '../Spinner/Spinner';

const UserRoute = ({ children, ...rest }) => {
  const user = useSelector((state) => state.user);

  return user && user.token ? (
    <Route {...rest} />
  ) : (
    <>
      <Spinner />
      <LoadingToRedirect />
    </>
  );
};

export default UserRoute;
