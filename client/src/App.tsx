import { useState, useEffect, useRef } from 'react';
import LogoScreen from './LogoScreen';
import ProductDisplay from './ProductDisplay';
import { Box, TextField, Container, CssBaseline } from '@mui/material';

interface Product {
  name: string;
  image: string;
  prices: { type: string; amount: number }[];
  description: string;
  codigo: string;
}

function App() {
  const [product, setProduct] = useState<Product | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchProductByBarcode = async (barcode: string): Promise<Product> => {
    const response = await fetch(`http://localhost:3000/api/product/${barcode}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  };

  const handleSearch = async (code: string) => {
    try {
      const prod = await fetchProductByBarcode(code);
      setProduct(prod);
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null); // Clear product on error
    }
  };

  useEffect(() => {
    if (product) {
      const timer = setTimeout(() => {
        setProduct(null);
      }, 30000); // 30 seconds
      return () => clearTimeout(timer);
    }
  }, [product]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      const code = inputRef.current.value;
      if (code) {
        handleSearch(code);
        inputRef.current.value = ''; // Clear after search
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Container component="main" maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', paddingTop: '20px' }}>
      <CssBaseline />
      <Box sx={{ marginBottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <TextField
          inputRef={inputRef}
          type="number"
          variant='outlined'
          label="Ingrese el código de barra del producto"
          fullWidth
          onKeyDown={handleKeyPress}
          onBlur={() => {
            setTimeout(() => {
              if (inputRef.current) inputRef.current.focus();
            }, 100);
          }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
        {product ? (
          <ProductDisplay product={product} />
        ) : (
          <LogoScreen />
        )}
      </Box>
    </Container>
  );
}

export default App;
