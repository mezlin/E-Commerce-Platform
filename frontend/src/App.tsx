import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import theme from "./theme/theme";
import { store } from "./store/store";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AddProductPage from "./pages/AddProductPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          autoHideDuration={3000}
        >
          <CssBaseline />
          <Router>
            <div
              style={{
                minHeight: "100vh",
                background: theme.palette.background.default,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Navbar />
              <Routes>
                <Route path="/" element={<ProductsPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/add" element={<AddProductPage />} />
                <Route path="/products/:id" element={<ProductDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/cart" element={<CartPage />} />
              </Routes>
            </div>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
