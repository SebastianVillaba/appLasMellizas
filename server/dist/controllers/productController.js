import { executeRequest, sql } from '../utils/dbHandler.js';
export const getProductByBarcode = async (req, res) => {
    const { barcode } = req.params;
    if (!barcode) {
        return res.status(400).json({ message: 'Barcode is required' });
    }
    try {
        const result = await executeRequest({
            query: 'sp_consultaPrecioGondola',
            inputs: [
                { name: 'codigoBarra', type: sql.VarChar(20), value: barcode }
            ],
            isStoredProcedure: true,
        });
        if (result && result.recordset && result.recordset.length > 0) {
            const productData = result.recordset[0];
            const formattedResult = {
                name: productData.mercaderia.replace('Mercadería:', '').trim(),
                image: '/placeholder.png', // Placeholder image for now
                prices: [
                    { type: 'Precio x Unidad', amount: parseFloat(productData.precio1.replace('Precio x Unidad: Gs.', '').replace('.', '').replace(',', '.')) },
                    { type: productData.precio2.startsWith('A Partir de') ? productData.precio2.split(':')[0].trim() : 'Cantidad', amount: parseFloat(productData.precio2.split(':')[1].replace('Gs.', '').replace('.', '').replace(',', '.')) }
                ],
                description: '', // The SP doesn't return a description field directly
                codigo: productData.codigo.replace('Codigo:', '').trim(),
            };
            res.status(200).json(formattedResult);
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        console.error('Error executing stored procedure:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
//# sourceMappingURL=productController.js.map