import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Box,
  Container,
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  Inventory,
  Assignment,
} from "@mui/icons-material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { motion } from "framer-motion";

const Navbar = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const location = useLocation();

  const NavButton = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <Button
      component={RouterLink}
      to={to}
      color="inherit"
      sx={{
        borderRadius: 2,
        mx: 1,
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          width: location.pathname === to ? "100%" : "0%",
          height: "2px",
          bgcolor: "white",
          transition: "width 0.3s ease-in-out",
        },
        "&:hover::after": {
          width: "100%",
        },
      }}
    >
      {children}
    </Button>
  );

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              background: "linear-gradient(45deg, #FFF 30%, #E3F2FD 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              flexGrow: 1,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            E-Commerce
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <NavButton to="/products">
              <Inventory sx={{ mr: 1 }} />
              Products
            </NavButton>

            {isAuthenticated ? (
              <>
                <NavButton to="/orders">
                  <Assignment sx={{ mr: 1 }} />
                  Orders
                </NavButton>
                <NavButton to="/profile">
                  <Person sx={{ mr: 1 }} />
                  Profile
                </NavButton>
              </>
            ) : (
              <>
                <NavButton to="/login">Login</NavButton>
                <NavButton to="/register">Register</NavButton>
              </>
            )}

            <RouterLink to="/cart" style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  color="inherit"
                  sx={{ ml: 2 }}
                >
                <Badge
                  badgeContent={cartItems.length}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      animation:
                        cartItems.length > 0 ? "pulse 1.5s infinite" : "none",
                      "@keyframes pulse": {
                        "0%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.2)" },
                        "100%": { transform: "scale(1)" },
                      },
                    },
                  }}
                >
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </motion.div>
            </RouterLink>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
