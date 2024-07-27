import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL_LOG } from '../var';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${API_URL_LOG}current-user`, {
            headers: { Authorization: `Bearer ${token}` } // Asegurarse de que el token se envíe correctamente
          });
          setUser(response.data);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Error fetching user.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, error, logout }}>
      {children}
    </UserContext.Provider>
  );
};
