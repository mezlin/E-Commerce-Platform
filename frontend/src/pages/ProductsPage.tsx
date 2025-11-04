import React, { useEffect, useState } from 'react';
import { Box, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';

interface Product {
	_id: string;
	name: string;
	description: string;
	price: number;
	quantity: number;
	category: string;
	sku: string;
	image?: string;
}

const ProductsPage: React.FC = () => {
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await getProducts();
				setProducts(response.data);
			} catch (error) {
				console.error('Error fetching products:', error);
			}
		};

		void fetchProducts();
	}, []);

		return (
			<Container maxWidth="lg" sx={{ mt: 4 }}>
				<Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
					<Button
						variant="contained"
						color="primary"
						component={Link}
						to="/products/add"
					>
						Add Product
					</Button>
				</Box>
				<Box
					sx={{
						display: 'grid',
						gap: 3,
						gridTemplateColumns: {
							xs: '1fr',
							sm: '1fr 1fr',
							md: '1fr 1fr 1fr',
							lg: 'repeat(4, 1fr)'
						}
					}}
				>
					{products.map((product) => (
						<Box key={product._id}>
							<ProductCard
								id={product._id}
								name={product.name}
								description={product.description}
								price={product.price}
								image={product.image}
							/>
						</Box>
					))}
				</Box>
			</Container>
		);
};

export default ProductsPage;

