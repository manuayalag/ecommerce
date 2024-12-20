import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductoPage from './pages/ProductoPage';
import CarritoPage from './pages/CarritoPage';
import ContactoPage from './pages/ContactoPage';
import LoginPage from './pages/LoginPage';
import { useState, useEffect, useContext } from 'react';
import './styles/App.css';
import { CarritoProvider } from './context/CarritoContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import productosData from './mocks/products.json';
import PropTypes from 'prop-types';

const App = () => {
  const { isAuthenticated } = useContext(AuthContext); // Obtener el estado de autenticación
  const [carrito, setCarrito] = useState([]); // Estado del carrito
  const [productos, setProductos] = useState([]); // Estado para los productos

  // Cargar productos desde productos.json o localStorage
  useEffect(() => {
    const loadProducts = () => {
      const storedProducts = localStorage.getItem('productos');
      if (storedProducts) {
        setProductos(JSON.parse(storedProducts)); // Si los productos están en localStorage
      } else {
        // Si no, cargamos los productos desde el archivo JSON
        setProductos(productosData);
        localStorage.setItem('productos', JSON.stringify(productosData)); // Guardamos los productos en localStorage
      }
    };

    loadProducts();
  }, []);

  // Función para agregar productos al carrito
  const agregarAlCarrito = (producto, cantidad) => {
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find(item => item.itemCode === producto.itemCode);
      if (productoExistente) {
        return prevCarrito.map(item =>
          item.itemCode === producto.itemCode ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad }];
      }
    });
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const actualizarCantidad = (itemCode, nuevaCantidad) => {
    setCarrito((prevCarrito) =>
      prevCarrito.map((producto) =>
        producto.itemCode === itemCode ? { ...producto, cantidad: nuevaCantidad } : producto
      )
    );
  };

  // Función para quitar un producto del carrito
  const quitarDelCarrito = (itemCode) => {
    setCarrito((prevCarrito) => prevCarrito.filter((producto) => producto.itemCode!== itemCode));
  };

  // Ruta privada (solo accesible si el usuario está autenticado)
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <AuthProvider>
      <CarritoProvider>
        <Router>
          <Header />
          <main>
            <Routes>
              <Route
                path="/productos"
                element={
                  <ProductoPage
                    agregarAlCarrito={agregarAlCarrito}
                    quitarDelCarrito={quitarDelCarrito}
                    productosDisponibles={productos}
                    carrito={carrito} // Pasamos el carrito como prop
                  />
                }
              />
              <Route
                path="/carrito"
                element={
                  <CarritoPage
                    productosEnCarrito={carrito}
                    actualizarCantidad={actualizarCantidad}
                    quitarDelCarrito={quitarDelCarrito}
                  />
                }
              />
              <Route path="/contacto" element={<ContactoPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProductoPage
                    agregarAlCarrito={agregarAlCarrito}
                    quitarDelCarrito={quitarDelCarrito}
                    productosDisponibles={productos}
                    carrito={carrito} // Pasamos el carrito como prop
                  />
                }
              />
              <Route
                path="/enviar-pedido"
                element={
                  <PrivateRoute>
                    <CarritoPage
                      productosEnCarrito={carrito}
                      actualizarCantidad={actualizarCantidad}
                      quitarDelCarrito={quitarDelCarrito}
                    />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <footer className="app-footer">
            &copy; {new Date().getFullYear()} STK. Todos los derechos reservados.
          </footer>
        </Router>
      </CarritoProvider>
    </AuthProvider>
  );
};

App.propTypes = {
  agregarAlCarrito: PropTypes.func,
  quitarDelCarrito: PropTypes.func,
  productosDisponibles: PropTypes.array,
  carrito: PropTypes.array,
  actualizarCantidad: PropTypes.func,
};

export default App;
