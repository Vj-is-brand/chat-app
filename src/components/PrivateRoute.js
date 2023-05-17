import React from 'react';
import { Container, Loader } from 'rsuite';
import { Redirect, Route } from 'react-router-dom';
import { useProfile } from '../context/profile.contex';

const PrivateRoute = ({ children, ...routeProps }) => {
  const { profile, isLoading } = useProfile();
  
  if (isLoading && !profile) {
    return (
      <Container>
        <Loader center vertical size="md" content="isLoading" speed="slow" />
      </Container>
    );
  }
  if (!profile && !isLoading) {
    return <Redirect to="/signin" />;
  }
  return <Route {...routeProps}> {children}</Route>;
};

export default PrivateRoute;
