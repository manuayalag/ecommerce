import { useState } from "react";
import "../styles/ProductoPage.css"; // Importa los estilos específicos

const ProductList = () => {
  const [cart, setCart] = useState([]);

  const products = [
    { id: 1, name: "Chorizo", price: 33000 },
    { id: 2, name: "Salchicha", price: 22500 },
    { id: 3, name: "Morcilla", price: 28000 },
    { id: 4, name: "Jamón", price: 21000 },
  ];

  const handleAddToCart = (productId, quantity) => {
    const product = products.find((p) => p.id === productId);
    if (!product || quantity <= 0) {
      alert("Por favor, ingrese una cantidad válida.");
      return;
    }

    const updatedCart = [...cart];
    const cartItemIndex = updatedCart.findIndex((item) => item.id === productId);

    if (cartItemIndex >= 0) {
      updatedCart[cartItemIndex].quantity += quantity;
    } else {
      updatedCart.push({ ...product, quantity });
    }

    setCart(updatedCart);
  };

  return (
    <div className="product-list">
      <h2>Productos</h2>
      <ul className="product-items">
        {products.map((product) => (
          <li className="product-item" key={product.id}>
            <div className="product-info">
              <strong>{product.name}</strong> - Gs.{product.price}/kg
            </div>
            <div className="product-controls">
              <input
                type="number"
                min="0"
                placeholder="KG"
                id={`quantity-${product.id}`}
                className="product-input"
              />
              <button
                className="add-to-cart-button"
                onClick={() => {
                  const quantity = parseFloat(
                    document.getElementById(`quantity-${product.id}`).value
                  );
                  handleAddToCart(product.id, quantity);
                }}
              >
                Añadir al carrito
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h3>Carrito</h3>
      {cart.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <ul className="cart-items">
          {cart.map((item) => (
            <li className="cart-item" key={item.id}>
              {item.name} - {item.quantity} KG - Total: $
              {(item.quantity * item.price).toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
