import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadStoredUser = async () => {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) {
        const { user, expiryDate, token } = JSON.parse(storedUser); // Ensure token is also retrieved
        if (Date.now() < expiryDate) {
          setUser(user);
          setToken(token); // Set the token
          setIsLoggedIn(true);
        } else {
          await AsyncStorage.removeItem('userData');
        }
      }
    };
    loadStoredUser();
  }, []);

  const login = async (userData) => {
    const { token, expiryDate, user } = userData;
    await AsyncStorage.setItem('userData', JSON.stringify({ token, expiryDate, user }));
    setUser(user);
    setToken(token); // Set the token
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userData');
    setUser(null);
    setToken(null); // Clear the token
    setIsLoggedIn(false);
  };

  return (
      <AuthContext.Provider value={{ user, isLoggedIn, token, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
};
