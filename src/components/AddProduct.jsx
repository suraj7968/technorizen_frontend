import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Grid, Typography, Box, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch categories when the component mounts
  useEffect(() => {
    axios
      .get("https://technorizen-backend.onrender.com/api/category/getCategories")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error("There was an error fetching categories!", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !categoryId || !price || !image) {
      setError("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("categoryId", categoryId);
    formData.append("price", price);
    formData.append("image", image);

    try {
      await axios.post("https://technorizen-backend.onrender.com/api/product/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/");
    } catch (err) {
      console.error("There was an error adding the product!", err);
      setError("Failed to add product");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Product
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 2 }}>
                Add Product
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default AddProduct;
