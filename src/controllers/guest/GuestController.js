import CategoryRepository from '../../repositories/CategoryRepository.js';
import MaterialRepository from '../../repositories/MaterialRepository.js';
import BrandRepository from '../../repositories/BrandRepository.js';
import OriginRepository from '../../repositories/OriginRepository.js';
import StylesRepository from '../../repositories/StylesRepository.js';

import ProductDetailRepository from '../../repositories/ProductDetailRepository.js';
import GuestService from '../../services/GuestService.js';
import httpStatus from 'http-status';
import ShopRepository from '../../repositories/ShopRepository.js';
import ShopService from '../../services/shop/ShopService.js';
import ProductRepository from '../../repositories/ProductRepository.js';
import { logger } from '../../index.js';

class GuestController {
    initRoutes(app) {
        app.get('/api/product/:id', this.findProductById); // Không yêu cầu authenticate
        app.get('/api/product-detail-by-product/:productId', this.findProductDetailByProductId); // Không yêu cầu authenticate
        app.get('/api/category/:categoryId', this.findCategoryById);
        app.get('/api/product-detail/:productDetailId', this.findProductDetailById); // Không yêu cầu authenticate
        app.get('/api/material/:materialId', this.findMaterialById);
        app.get('/api/brand/:brandId', this.findBrandById);
        app.get('/api/styles/:stylesId', this.findStylesById);
        app.get('/api/origin/:originId', this.findOriginById);
        app.get('/api/shop/:shopId', this.findShopById);
        app.get('/api/shop/:shopId', this.findShopById);
        app.get('/api/product-by-shop/:shopId', this.findProductByShop_Sorted);
        app.post('/api/top-product-by-shop/:shopId', this.findProductTopByShop);
        app.post('/api/product-many', this.findProduct);
        app.post('/api/search-product-by-name', this.findProductByName);
        app.get('/api/keyword-hot', this.findKeywordHot);
        app.get('/api/product-similar/:productId/:take', this.findProductSimilar);
        app.get('/api/get-category', this.findAllCategory);
        app.get('/api/get-product-top', this.findProductTop);
        app.get('/api/get-product-by-category/:categoryId/:take', this.findProductByCategory);
    }
    async findProductByCategory(req, res) {
        try {
            const categoryId = req.params.categoryId;
            const take = req.params.take;
            const products = await GuestService.findProductByCategory(categoryId,take);
            if (products != 'Fail') {
                return res.status(httpStatus.OK).json({ message: 'Suucess', products });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findProductTop(req, res) {
        try {
            const productsTop = await GuestService.findProductTop();
            if (productsTop == 'Fail') {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            } else {
                return res.status(httpStatus.OK).json({ message: 'Success', productsTop });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findAllCategory(req, res) {
        try {
            const categorys = await CategoryRepository.findAll();
            if (categorys) {
                return res.status(httpStatus.OK).json({ message: 'Success', categorys });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findProductSimilar(req, res) {
        try {
            const productId = req.params.productId;
            const take = req.params.take;

            const productsSimilar = await GuestService.findProductSimilar(productId, parseInt(take));
            if (productsSimilar != 'Fail') {
                return res.status(httpStatus.OK).json({ message: 'Success', productsSimilar });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findKeywordHot(req, res) {
        try {
            const keywords = await GuestService.findKeywordHot(6);
            if (keywords) {
                return res.status(httpStatus.OK).json({ message: 'Success', keywords });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findProduct(req, res) {
        try {
            console.log(req.body);
            const products = await GuestService.findProduct(req.body.take);
            if (products == 'Fail') {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            } else {
                return res.status(httpStatus.OK).json({ message: 'Success', products });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findProductByName(req, res) {
        try {
            const product = await GuestService.findProductByName(req);
            if (product != 'Fail') {
                if (product.length > 0 && req.body.name != '')
                    logger.info({ message: `User searched for: ${req.body.name}`, timestamp: new Date() });
                return res.status(httpStatus.OK).json({ message: 'Success', product });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }

    async findProductTopByShop(req, res) {
        try {
            const shopId = req.params.shopId;
            const topProducts = await GuestService.findProductsTopByShop(shopId, req.body.listProductsId);
            if (topProducts != 'Fail') {
                return res.status(httpStatus.OK).json({ message: 'Success', topProducts });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findProductByShop_Sorted(req, res) {
        try {
            const shopId = req.params.shopId;

            const products = await GuestService.findProductsByShop_Sorted(shopId);
            if (products == 'Fail') {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            } else {
                return res.status(httpStatus.OK).json({ message: 'Success', products });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findShopById(req, res) {
        try {
            const shopId = req.params.shopId;
            const shop = await ShopService.get(shopId);
            if (shop != 'Fail') {
                return res.status(httpStatus.OK).json({ message: 'Success', shop });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findMaterialById(req, res) {
        try {
            const materialId = req.params.materialId;
            const material = await MaterialRepository.find(materialId);
            console.log(material);
            if (material) {
                return res.status(httpStatus.OK).json({ message: 'Success', material });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch (e) {
            console.err(e.message);
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findBrandById(req, res) {
        try {
            const brandId = req.params.brandId;
            const brand = await BrandRepository.find(brandId);
            if (brand) {
                return res.status(httpStatus.OK).json({ message: 'Success', brand });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch (e) {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findStylesById(req, res) {
        try {
            const stylesId = req.params.stylesId;
            const styles = await StylesRepository.find(stylesId);
            if (styles) {
                return res.status(httpStatus.OK).json({ message: 'Success', styles });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findOriginById(req, res) {
        try {
            const originId = req.params.originId;
            const origin = await OriginRepository.find(originId);
            if (origin) {
                return res.status(httpStatus.OK).json({ message: 'Success', material });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findCategoryById(req, res) {
        try {
            const categoryId = req.params.categoryId;
            const category = await CategoryRepository.find(categoryId);
            if (category) {
                return res.status(httpStatus.OK).json({ message: 'Success', category });
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
            return res.status(httpStatus.OK).json({ message: 'Success', productDetail });
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async findProductById(req, res) {
        const productId = req.params.id;

        try {
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
