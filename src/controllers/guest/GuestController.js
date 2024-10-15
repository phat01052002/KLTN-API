import CategoryRepository from '../../repositories/CategoryRepository.js';
import ProductDetailRepository from '../../repositories/ProductDetailRepository.js';
import GuestService from '../../services/GuestService.js';
import httpStatus from 'http-status';

class GuestController {
    initRoutes(app) {
        app.get('/api/product/:id', this.findProductById); // Không yêu cầu authenticate
        app.get('/api/product-detail-by-product/:productId', this.findProductDetailByProductId); // Không yêu cầu authenticate
        app.get('/api/category/:categoryId', this.findCategoryById);
        app.get('/api/product-detail/:productDetailId', this.findProductDetailById); // Không yêu cầu authenticate
    }
    async findCategoryById(req, res) {
        try {
            const categoryId = req.params.categoryId;
            const category = await CategoryRepository.find(categoryId);
            if (category) {
                return res.status(httpStatus.OK).json({ category });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findProductDetailByProductId(req, res) {
        try {
            const productId = req.params.productId;
            const productDetail = await ProductDetailRepository.findByProductId(productId);
            return res.status(httpStatus.OK).json({ productDetail });
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findProductDetailById(req, res) {
        try {
            const productDetailId = req.params.productDetailId;
            const productDetail = await ProductDetailRepository.find(productDetailId);
            return res.status(httpStatus.OK).json({ productDetail });
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findProductById(req, res) {
        const productId = req.params.id;

        try {
            console.log(`Fetching product with ID: ${productId}`);
            const product = await GuestService.findProductById(productId);
            if (product == 'Product block') {
                return res.status(404).json({ message: 'Product block' });
            }
            if (product == '404') {
                return res.status(404).json({ message: '404' });
            }
            if (product) {
                return res.status(200).json({ product });
            } else {
                return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
            }
        } catch (e) {
            console.error(e.message);
            return res.status(502).json({ message: 'Đã xảy ra lỗi' });
        }
    }
}

export default new GuestController();
