import axios from 'axios';

const API_URL = 'http://localhost:4001/api';

export interface ProductCreateData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image?: File | string;
}

export const getProducts = () => axios.get(`${API_URL}/products`);
export const getProductById = (id: string) => axios.get(`${API_URL}/products/${id}`);
export const updateProductQuantity = (id: string, quantity: number) => 
  axios.patch(`${API_URL}/products/${id}/quantity`, { quantity });

export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axios.post(`${API_URL}/products/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  // The server returns the full path that can be used to access the image
  return `http://localhost:4001${response.data.imageUrl}`;
};

export const deleteProduct = (id: string) => axios.delete(`${API_URL}/products/${id}`);

export const createProduct = async (data: ProductCreateData) => {
  let imageUrl = '';
  if (data.image) {
    // If image is a File, upload it. If it's a string (URL), use it directly
    imageUrl = data.image instanceof File ? await uploadProductImage(data.image) : data.image;
  }
  
  return axios.post(`${API_URL}/products`, {
    ...data,
    image: imageUrl,
  });
};