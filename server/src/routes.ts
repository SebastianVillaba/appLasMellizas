import { Router } from 'express';
import { getProductByBarcode } from './controllers/productController.js';

const router = Router();

router.get('/product/:barcode', getProductByBarcode);

export default router;
