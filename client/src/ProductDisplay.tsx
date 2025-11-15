import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';

interface Product {
  name: string;
  image: string;
  prices: { type: string; amount: number }[];
  description: string;
  codigo: string;
}

interface ProductDisplayProps {
  product: Product;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ product }) => {
  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'row',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      maxWidth: '800px',
      width: '100%',
      gap: '20px',
    }}>
      <CardMedia
        component="img"
        sx={{
          flex: 1,
          minWidth: '200px',
          minHeight: '200px',
          objectFit: 'contain',
          borderRadius: '10px',
          backgroundColor: '#f8f8f8',
        }}
        image={product.image}
        alt={product.name}
      />
      <CardContent sx={{
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '10px',
      }}>
        <Typography variant="h4" component="h2" sx={{ margin: 0, color: '#333' }}>{product.name}</Typography>
        <Typography variant="body1" sx={{ margin: 0, color: '#555' }}>Código: {product.codigo}</Typography>
        <Box sx={{ marginTop: '10px' }}>
          {product.prices.map((price, index) => (
            <Typography key={index} variant="body1" sx={{ margin: '5px 0', color: '#007bff' }}>
              {price.type}: Gs. {price.amount.toLocaleString()}
            </Typography>
          ))}
        </Box>
        <Typography variant="body2" sx={{ margin: '0', color: '#777' }}>{product.description}</Typography>
      </CardContent>
    </Card>
  );
};

export default ProductDisplay;
