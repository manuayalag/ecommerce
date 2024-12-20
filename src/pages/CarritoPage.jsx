import PropTypes from 'prop-types';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/CarritoPage.css';

const CarritoPage = ({ productosEnCarrito, actualizarCantidad, quitarDelCarrito }) => {
  const { currentUser } = useContext(AuthContext);

  const calcularTotal = () => {
    return productosEnCarrito.reduce((total, producto) => {
      const precio = parseFloat(producto.price); // Aseguramos que el precio sea un número
      const cantidad = parseFloat(producto.cantidad); // Aseguramos que la cantidad sea un número
      if (isNaN(precio) || isNaN(cantidad)) {
        return total; // Si alguno de los valores no es numérico, no lo sumamos
      }
      return total + precio * cantidad; // Si ambos son válidos, los sumamos
    }, 0);
  };

  const handleEnviarPedido = async () => {
    if (!currentUser) {
      alert('Debe autenticarse antes de realizar un pedido.');
      return;
    }

    if (productosEnCarrito.length === 0) {
      alert('No hay productos en el carrito.');
      return;
    }

    const orderData = {
      cardCode: currentUser.cardCode, // Código del cliente autenticado
      comments: 'Pedido realizado desde la Web', // Comentarios opcionales
      items: productosEnCarrito.map((producto) => ({
        itemCode: producto.itemCode,
        quantity: producto.cantidad,
        price: producto.price,
      })),
    };

    try {
      const response = await axios.post('https://localhost:7104/api/Order/CreateOrder', orderData);
      alert(`Pedido creado exitosamente con ID: ${response.data.orderID}`);
    } catch (err) {
      console.error('Error al crear el pedido:', err.message);
      alert('Error al crear el pedido: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div>
      <h2>Carrito</h2>
      {productosEnCarrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <table className="carrito-tabla">
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
            {productosEnCarrito.map((producto) => (
              <tr key={producto.itemCode} className="producto-en-carrito">
                <td>{producto.itemCode}</td>
                <td>{producto.itemName}</td>
                <td>Gs. {producto.price.toLocaleString('es-PY')}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={producto.cantidad}
                    onChange={(e) => actualizarCantidad(producto.itemCode, parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <button onClick={() => quitarDelCarrito(producto.itemCode)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3 className="total">Total: Gs. {calcularTotal().toLocaleString('es-PY')}</h3>
      <button className="enviar-pedido" onClick={handleEnviarPedido}>
        Enviar Pedido
      </button>
    </div>
  );
};

CarritoPage.propTypes = {
  productosEnCarrito: PropTypes.array.isRequired,
  actualizarCantidad: PropTypes.func.isRequired,
  quitarDelCarrito: PropTypes.func.isRequired,
};

export default CarritoPage;
