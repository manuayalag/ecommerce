import PropTypes from 'prop-types';
import '../styles/CarritoPage.css';

const CarritoPage = ({ productosEnCarrito, actualizarCantidad, quitarDelCarrito }) => {
  const calcularTotal = () => {
    return productosEnCarrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  };

  return (
    <div>
      <h2>Carrito</h2>
      {productosEnCarrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div className="carrito-lista">
          {productosEnCarrito.map((producto) => (
            <div key={producto.id} className="producto-en-carrito">
              <h3>{producto.nombre}</h3>
              <p>Gs. {producto.precio.toLocaleString('es-PY')}</p>
              <div className="producto-actions">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={producto.cantidad}
                  onChange={(e) => actualizarCantidad(producto.id, parseFloat(e.target.value))}
                />
                <button onClick={() => quitarDelCarrito(producto.id)}>Eliminar</button>
              </div>
            </div>
          ))}
          <h3 className="total">Total: Gs. {calcularTotal().toLocaleString('es-PY')}</h3>
        </div>
      )}
    </div>
  );
};

CarritoPage.propTypes = {
  productosEnCarrito: PropTypes.array.isRequired,
  actualizarCantidad: PropTypes.func.isRequired,
  quitarDelCarrito: PropTypes.func.isRequired,
};

export default CarritoPage;