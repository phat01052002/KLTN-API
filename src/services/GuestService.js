import ProductRepository from '../repositories/ProductRepository.js';

class GuestService {
    async findProductById(productId) {
        try {
            const product = await ProductRepository.findById(productId);
            return product; // Trả về sản phẩm tìm thấy
        } catch (e) {
            console.error(e.message);
            throw new Error('Error retrieving product');
        }
    }
}

export default new GuestService();