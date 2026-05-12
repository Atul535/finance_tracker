import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
