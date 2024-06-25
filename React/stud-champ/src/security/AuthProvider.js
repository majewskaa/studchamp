import React, { useEffect } from 'react';
import { isAuthenticated } from './usosAuthorisation';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};