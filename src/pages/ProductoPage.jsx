import PropTypes from 'prop-types';
import { useState } from 'react';
import '../styles/ProductoPage.css';

const ProductoPage = ({ productosDisponibles, agregarAlCarrito, quitarDelCarrito, carrito }) => {
  const [cantidades, setCantidades] = useState({});
  const [filtro, setFiltro] = useState('');

  const handleCantidadChange = (id, cantidad) => {
    setCantidades((prevCantidades) => ({
      ...prevCantidades,
      [id]: cantidad,
    }));
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const productosFiltrados = productosDisponibles.filter((producto) =>
    producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    producto.id.toString().includes(filtro)
  );

  const isInCarrito = (id) => {
    return carrito.some((producto) => producto.id === id);
  };

  return (
    <div>
      <h2>Productos Disponibles</h2>
      <input
        type="text"
        placeholder="Buscar productos por ID o nombre..."
        value={filtro}
        onChange={handleFiltroChange}
        className="filtro-input"
      />
      {productosDisponibles.length === 0 ? (
        <p>Cargando productos...</p>
      ) : (
        <table className="productos-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados
              .sort((a, b) => b.ventas - a.ventas)
              .map((producto) => (
                <tr key={producto.id} className="producto-item">
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>Gs. {producto.precio.toLocaleString('es-PY')}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cantidades[producto.id] || 0}
                      onChange={(e) => handleCantidadChange(producto.id, parseFloat(e.target.value))}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        isInCarrito(producto.id)
                          ? quitarDelCarrito(producto.id)
                          : agregarAlCarrito(producto, cantidades[producto.id] || 0)
                      }
                      className={isInCarrito(producto.id) ? 'disabled' : ''}
                      disabled={isInCarrito(producto.id)}
                    >
                      <i className="fas fa-shopping-cart"></i> {/* Icono de carrito */}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

ProductoPage.propTypes = {
  productosDisponibles: PropTypes.array.isRequired,
  agregarAlCarrito: PropTypes.func.isRequired,
  quitarDelCarrito: PropTypes.func.isRequired,
  carrito: PropTypes.array.isRequired,
};

export default ProductoPage;