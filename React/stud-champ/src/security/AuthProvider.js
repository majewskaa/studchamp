import React, { useEffect } from 'react';
import { isAuthenticated, getUserId } from './usosAuthorisation';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userId, setUserId] = React.useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setIsLoggedIn(true);

      setUserId(getUserId());
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userId }}>
      {children}
    </AuthContext.Provider>
  );
};