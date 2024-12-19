import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// Creamos el contexto del carrito
const CarritoContext = createContext();

// Este es el proveedor del contexto
export const CarritoProvider = ({ children }) => {
  const [productosEnCarrito, setProductosEnCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setProductosEnCarrito((prevCarrito) => {
      if (!prevCarrito.some((prod) => prod.id === producto.id)) {
        return [...prevCarrito, producto];
      }
      return prevCarrito;
    });
  };

  const quitarDelCarrito = (id) => {
    setProductosEnCarrito((prevCarrito) => prevCarrito.filter((producto) => producto.id !== id));
  };

  const actualizarCantidad = (id, cantidad) => {
    setProductosEnCarrito((prevCarrito) =>
      prevCarrito.map((producto) =>
        producto.id === id ? { ...producto, cantidad } : producto
      )
    );
  };

  return (
    <CarritoContext.Provider value={{ productosEnCarrito, agregarAlCarrito, quitarDelCarrito, actualizarCantidad }}>
      {children}
    </CarritoContext.Provider>
  );
};

CarritoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook para usar el contexto en cualquier parte
export const useCarrito = () => useContext(CarritoContext);
