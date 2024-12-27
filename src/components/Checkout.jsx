import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import axios from "axios";

const Checkout = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info"); // To control Snackbar severity

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const fetchCartProducts = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      setMessage("You need to log in to view your cart.");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(
        "https://technorizen-backend.onrender.com/api/checkout/getUserCartProducts",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCartProducts(response.data.products);
        setMessage("Cart products fetched successfully.");
        setSeverity("success");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error fetching cart products!", error);
      setMessage("Failed to fetch cart products.");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleRemoveProduct = async (productId) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      setMessage("You need to log in to remove products.");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(
        "https://technorizen-backend.onrender.com/api/checkout/removeProductFromCart",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchCartProducts();
        setMessage("Product removed from cart successfully.");
        setSeverity("success");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error removing product from cart!", error);
      setMessage("Failed to remove product from cart.");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>
      {cartProducts.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <img
                      src={`https://technorizen-backend.onrender.com/${product.image}`}
                      alt={product.name}
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{new Date(product.createdAt).toLocaleDateString("en-GB")}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRemoveProduct(product._id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No products in the cart.</p>
      )}

      {/* Snackbar for messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Checkout;
