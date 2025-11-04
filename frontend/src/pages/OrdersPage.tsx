import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { getOrders } from '../services/orderService';

interface Order {
  _id: string;
  userId: string;
  products: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount: number;
  createdAt?: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    void fetchOrders();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <List>
        {orders.map((order) => (
          <React.Fragment key={order._id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={`Order ${order._id} — $${order.totalAmount.toFixed(2)}`}
                secondary={
                  <>
                    <div>Items: {order.products.length}</div>
                    <div>{order.createdAt ? `Created: ${new Date(order.createdAt).toLocaleString()}` : null}</div>
                  </>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default OrdersPage;
