import axios from 'axios';

const API_URL = 'http://localhost:7104/api';  // Cambiar por tu URL de la API

export const getProductos = async (clienteAutenticado) => {
  const priceList = clienteAutenticado ? clienteAutenticado.ListNum : 13; // Precio cliente si está autenticado
  const response = await axios.get(`${API_URL}/Product/Products`, {
    params: { priceList }, // Enviar el priceList como parámetro
  });
  return response.data;
};
