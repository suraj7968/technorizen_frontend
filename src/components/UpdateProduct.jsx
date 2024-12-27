import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    categoryId: "",
    price: "",
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("https://technorizen-backend.onrender.com/api/product/getProductById", { id })
      .then((response) => {
        setProduct(response.data.product);
      })
      .catch((error) => {
        console.error("There was an error fetching the product!", error);
      });

    axios
      .get("https://technorizen-backend.onrender.com/api/category/getCategories")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error("There was an error fetching categories!", error);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.name ||
      !product.categoryId ||
      !product.price ||
      !product.image
    ) {
      setError("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("categoryId", product.categoryId);
    formData.append("price", product.price);
    formData.append("image", product.image);
    formData.append("productId", id);

    try {
      await axios.post(`https://technorizen-backend.onrender.com/api/product/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      navigate("/");
    } catch (err) {
      console.error("There was an error updating the product!", err);
      setError("Failed to update product");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Update Product
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Product Name"
                variant="outlined"
                fullWidth
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
                required
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Category"
                fullWidth
                value={product.categoryId}
                onChange={(e) =>
                  setProduct({ ...product, categoryId: e.target.value })
                }
                required
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </TextField>
            </Grid>

            {/* Display current image if it exists */}
            {product.image && (
              <Grid item xs={12}>
                <Typography variant="body1">Current Image:</Typography>
                <img
                  src={`https://technorizen-backend.onrender.com/${product.image}`} // Assuming the image path is correct
                  alt="Current Product"
                  style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: "10px" }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <input
                type="file"
                onChange={(e) =>
                  setProduct({ ...product, image: e.target.files[0] })
                }
                accept="image/*"
                required={product.image === null} // Only require file input if no image is selected
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                sx={{ mt: 2 }}
              >
                Update Product
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default UpdateProduct;
