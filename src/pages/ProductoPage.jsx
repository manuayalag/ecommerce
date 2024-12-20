import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/ProductoPage.css';

const ProductoPage = ({ agregarAlCarrito, quitarDelCarrito, carrito }) => {
  const { currentUser } = useContext(AuthContext); // Obtener el cliente autenticado
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [filtro, setFiltro] = useState('');
  const [error, setError] = useState(null);

  // Obtener productos de la API
  const fetchProductos = async () => {
    try {
      const priceList = currentUser ? currentUser.listNum : 13; // Usar lista de precios predeterminada si no hay cliente
      console.log(`Usando priceList: ${priceList}`);
      
      const response = await axios.get('https://localhost:7104/api/Product/GetProducts', {
        params: { priceList }, // Siempre enviar priceList como parámetro
      });
      console.log("Productos recibidos:", response.data);
      setProductos(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar productos:", err.message);
      setError('Error al cargar los productos.');
      setProductos([]);
    }
  };

  // Cargar productos al inicio y cuando currentUser cambie
  useEffect(() => {
    fetchProductos();
  }, [currentUser]); // Ejecuta fetchProductos cuando currentUser cambia

  // Manejar el cambio en la cantidad
  const handleCantidadChange = (id, cantidad) => {
    setCantidades((prevCantidades) => ({
      ...prevCantidades,
      [id]: cantidad,
    }));
  };

  // Manejar el filtro de búsqueda
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  // Filtrar los productos
  const productosFiltrados = productos.filter((producto) =>
    producto.itemName.toLowerCase().includes(filtro.toLowerCase()) ||
    producto.itemCode.toString().includes(filtro)
  );

  // Comprobar si el producto está en el carrito
  const isInCarrito = (id) => carrito.some((producto) => producto.itemCode === id);

  return (
    <div>
      <h2>Productos Disponibles</h2>
      <input
        type="text"
        placeholder="Buscar productos por ID o itemName..."
        value={filtro}
        onChange={handleFiltroChange}
        className="filtro-input"
      />
      {error && <p>{error}</p>}
      {productos.length === 0 ? (
        <p>Cargando productos...</p>
      ) : (
        <table className="productos-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>itemName</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados
              .sort((a, b) => b.ventas - a.ventas) // Ordenar productos por ventas
              .map((producto) => (
                <tr key={producto.itemCode} className="producto-item">
                  <td>{producto.itemCode}</td>
                  <td>{producto.itemName}</td>
                  <td>Gs. {producto.price.toLocaleString('es-PY')}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cantidades[producto.itemCode] || 0}
                      onChange={(e) => handleCantidadChange(producto.itemCode, parseFloat(e.target.value))}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        isInCarrito(producto.itemCode)
                          ? quitarDelCarrito(producto.itemCode)
                          : agregarAlCarrito(producto, cantidades[producto.itemCode] || 0)
                      }
                      className={isInCarrito(producto.itemCode) ? 'disabled' : ''}
                      disabled={isInCarrito(producto.itemCode)}
                    >
                      <i className="fas fa-shopping-cart"></i>
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
  agregarAlCarrito: PropTypes.func.isRequired,
  quitarDelCarrito: PropTypes.func.isRequired,
  carrito: PropTypes.array.isRequired,
};

export default ProductoPage;
