import { executeRequest, sql } from '../utils/dbHandler.js';
const parsePrice = (priceString, splitIndex = 0) => {
    try {
        // 1. Obtener la parte del precio (después de ':') o usar la cadena completa
        // FIX: Usamos optional chaining (?.) y nullish coalescing (??) para evitar llamar .trim() en 'undefined'.
        let rawValue = priceString.includes(':')
            ? (priceString.split(':')[splitIndex]?.trim() ?? '')
            : priceString.trim();
        // 2. Eliminar texto irrelevante y separadores de miles
        // Utilizamos un regex global para asegurar que eliminamos todas las ocurrencias
        rawValue = rawValue.replace(/Precio x Unidad:|A Partir de|Gs\./g, '').replace(/\./g, '');
        // 3. Reemplazar coma por punto como separador decimal (si aplica)
        rawValue = rawValue.replace(',', '.');
        const amount = parseFloat(rawValue);
        return isNaN(amount) ? 0 : amount; // Devuelve 0 si la conversión falla
    }
    catch (e) {
        console.warn('Fallo al parsear el precio:', priceString, e);
        return 0;
    }
};
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
                    {
                        type: 'Precio x Unidad',
                        // ANTES: amount: parseFloat(productData.precio1.replace('Precio x Unidad: Gs.', '').replace('.', '').replace(',', '.'))
                        amount: parsePrice(productData.precio1) // AHORA usando la función robusta
                    },
                    {
                        type: productData.precio2.startsWith('A Partir de') ? productData.precio2.split(':')[0].trim() : 'Cantidad',
                        // ANTES: amount: parseFloat(productData.precio2.split(':')[1].replace('Gs.', '').replace('.', '').replace(',', '.')) 
                        amount: parsePrice(productData.precio2, 1) // AHORA usando la función robusta
                    }
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