import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/v1/auth/me');
        setUser(response.data.data);
      } catch (err) {
        console.error('Error fetching current user:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);


  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/api/v1/auth/login', { email, password });
      localStorage.setItem('token', response.data.data.token);
      setUser(response.data.data.user);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (key === 'profileImage' && userData[key]) {
          formData.append('image', userData[key]);
        } else {
          formData.append(key, userData[key]);
        }
      });
      
      const response = await api.post('/api/v1/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      
      localStorage.setItem('token', response.data.data.token);
      setUser(response.data.data.user);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};