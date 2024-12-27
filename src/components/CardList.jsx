import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CardList = () => {
  const [products, setProducts] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false); // State to control Snackbar visibility
  const [message, setMessage] = useState(""); // State to hold the message for Snackbar
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the API
    axios
      .get(`https://technorizen-backend.onrender.com/api/product/fetchProducts`)
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  const handleUpdateProduct = (productId) => {
    navigate(`/update-product/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(
        "https://technorizen-backend.onrender.com/api/product/delete",
        {
          data: { productId },
        }
      );
      if (response.status === 200) {
        setProducts(products.filter((product) => product._id !== productId));
        setMessage("Product deleted successfully!");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("There was an error deleting the product!", error);
      setMessage("Failed to delete the product.");
      setOpenSnackbar(true);
    }
  };

  const handleCheckout = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://technorizen-backend.onrender.com/api/checkout",
        {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/checkout");
        setMessage("Checkout successful.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("There was an error processing the checkout!", error);
      setMessage("Checkout failed.");
      setOpenSnackbar(true);
      navigate("/login");
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddProduct}
        sx={{ mb: 3 }}
      >
        Add Product
      </Button>

      <Grid container spacing={3}>
        {products.map((product, index) => (
          <Grid
            item
            xs={12}
            sm={3}
            mt={5}
            style={{ position: "relative", top: "50px" }}
            key={index}
          >
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`https://technorizen-backend.onrender.com/${product.image}`}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ${product.price}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => handleUpdateProduct(product._id)}
                  sx={{ mt: 2 }}
                >
                  Update Product
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={() => handleDeleteProduct(product._id)}
                  sx={{ mt: 2 }}
                >
                  Delete Product
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleCheckout(product._id)} // Trigger checkout on click
                  sx={{ mt: 2 }}
                >
                  Checkout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar for success/error message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={message === "Checkout successful." ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CardList;
