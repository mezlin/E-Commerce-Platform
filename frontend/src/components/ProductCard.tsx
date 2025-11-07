import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  IconButton,
  Chip,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { Link as RouterLink } from "react-router-dom";
import { deleteProduct } from "../services/productService";
import { motion } from "framer-motion";
import { AddShoppingCart, Visibility, Delete } from "@mui/icons-material";
import { useSnackbar } from "notistack";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  image,
}) => {
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: id,
        name,
        price,
        quantity: 1,
      })
    );
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        window.location.reload(); // Refresh the page to show updated list
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const { enqueueSnackbar } = useSnackbar();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCartWithNotification = () => {
    handleAddToCart();
    enqueueSnackbar("Product added to cart", { variant: "success" });
  };

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={`${process.env.REACT_APP_INVENTORY_API_URL}${image}` || "https://via.placeholder.com/200"}
        alt={name}
        sx={{
          transition: "transform 0.3s ease-in-out",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" noWrap>
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 2,
          }}
        >
          {description}
        </Typography>
        <Chip
          label={`$${price.toFixed(2)}`}
          color="primary"
          sx={{
            fontWeight: "bold",
            fontSize: "1.1rem",
            height: 32,
          }}
        />
      </CardContent>
      <CardActions sx={{ padding: 2, justifyContent: "space-between" }}>
        <IconButton
          color="primary"
          onClick={handleAddToCartWithNotification}
          sx={{
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.2s",
          }}
        >
          <AddShoppingCart />
        </IconButton>
        <IconButton
          component={RouterLink}
          to={`/products/${id}`}
          color="info"
          sx={{
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.2s",
          }}
        >
          <Visibility />
        </IconButton>
        <IconButton
          color="error"
          onClick={handleDelete}
          sx={{
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.2s",
          }}
        >
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
