import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import HomePage from '../pages/homePage/HomePage';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const { user } = useAuth();
    return (
            <Route
            {...rest}
            element={<HomePage/>}
        />
            );
};

export default PrivateRoute;