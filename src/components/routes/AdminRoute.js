import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import LoadingToRedirect from './LoadingToRedirect';
import { currentAdmin } from '../../functions/auth';
import Spinner from '../Spinner/Spinner';

const AdminRoute = ({ children, ...rest }) => {
  const user = useSelector((state) => state.user);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((response) => {
          console.log('CURRENT ADMIN RESPONSE', response);
          setOk(true);
        })
        .catch((error) => {
          console.log('ADMIN ROUTE ERROR', error);
          setOk(false);
        });
    }
  }, [user]);

  return ok ? (
    <Route {...rest} />
  ) : (
    <>
      <Spinner />
      <LoadingToRedirect />
    </>
  );
};

export default AdminRoute;
