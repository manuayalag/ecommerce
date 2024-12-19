import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductoPage from './pages/ProductoPage';
import CarritoPage from './pages/CarritoPage';
import ContactoPage from './pages/ContactoPage';
import { useState, useEffect } from 'react';
import './styles/App.css';
import { CarritoProvider } from './context/CarritoContext';
import productosData from './mocks/products.json';

const App = () => {
  const [carrito, setCarrito] = useState([]); // Estado del carrito
  const [productos, setProductos] = useState([]); // Estado para los productos

  // Cargar productos desde productos.json
  useEffect(() => {
    setProductos(productosData);
  }, []);

  // Función para agregar productos al carrito
  const agregarAlCarrito = (producto, cantidad) => {
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find(item => item.id === producto.id);
      if (productoExistente) {
        return prevCarrito.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad }];
      }
    });
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const actualizarCantidad = (id, nuevaCantidad) => {
    setCarrito((prevCarrito) =>
      prevCarrito.map((producto) =>
        producto.id === id ? { ...producto, cantidad: nuevaCantidad } : producto
      )
    );
  };

  // Función para quitar un producto del carrito
  const quitarDelCarrito = (id) => {
    setCarrito((prevCarrito) => prevCarrito.filter((producto) => producto.id !== id));
  };

  return (
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
          </Routes>
        </main>
        <footer className="app-footer">
          &copy; {new Date().getFullYear()} STK. Todos los derechos reservados.
        </footer>
      </Router>
    </CarritoProvider>
  );
};

export default App;