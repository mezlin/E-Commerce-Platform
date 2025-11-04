import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Snackbar, IconButton } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { createProduct, uploadProductImage, ProductCreateData } from '../services/productService';

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<ProductCreateData, 'image'>>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value
    }));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create a temporary preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      try {
        setIsUploading(true);
        // Upload the image immediately when selected
        const uploadedImageUrl = await uploadProductImage(file);
        setImageUrl(uploadedImageUrl);
        console.log('Uploaded image URL:', uploadedImageUrl);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload image');
        setSelectedImage(null);
        setImagePreview(null);
      } finally {
        setIsUploading(false);
      }
      
      // Cleanup the temporary URL when preview changes
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImage && !imageUrl) {
      setError('Please wait for the image to finish uploading');
      return;
    }
    try {
      console.log('Creating product with image URL:', {
        ...formData,
        image: imageUrl
      });
      await createProduct({
        ...formData,
        image: imageUrl // Use the uploaded image URL
      });
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Add New Product
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            
            <TextField
              required
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                required
                type="number"
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ flex: 1 }}
              />
              
              <TextField
                required
                type="number"
                label="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                sx={{ flex: 1 }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                required
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                sx={{ flex: 1 }}
              />
            </Box>
            
            <Box sx={{ mt: 2, mb: 2 }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleImageSelect}
              />
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              {imagePreview && (
                <Box sx={{ mt: 2, position: 'relative', width: 200 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100%', height: 'auto' }}
                  />
                  <IconButton
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                  >
                    ✕
                  </IconButton>
                </Box>
              )}
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" size="large">
                Create Product
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/products')} 
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success">Product created successfully!</Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AddProductPage;