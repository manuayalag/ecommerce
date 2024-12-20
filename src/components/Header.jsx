import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { isAuthenticated, currentUser, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <nav>
        <ul>
          <li>
            <Link to="/productos">Productos</Link>
          </li>
          <li>
            <Link to="/carrito">Carrito</Link>
          </li>
          <li>
            <Link to="/contacto">Contacto</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <span>Bienvenido, {currentUser.cardName}</span>
              </li>
              <li>
                <button onClick={logout}>Cerrar Sesión</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">Iniciar Sesión</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;