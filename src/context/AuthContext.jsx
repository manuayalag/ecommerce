import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = "https://localhost:7104/api";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  const login = async (rucOrCi) => {
    try {
      const response = await axios.post(
        `${API_URL}/Auth/Authenticate`,
        JSON.stringify(rucOrCi), // Convertimos el string en JSON
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setIsAuthenticated(true);
      setCurrentUser(response.data);
      setError(null);
    } catch (err) {
      console.error(err.response);
      if (err.response) {
        setError(err.response.data || 'Cliente no encontrado');
      } else {
        setError('Error al conectar con el servidor');
      }
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
