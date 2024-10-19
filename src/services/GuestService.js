import ProductDetailRepository from '../repositories/ProductDetailRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import removeAccents from 'remove-accents';
import fs from 'fs/promises';
import path from 'path';
class GuestService {
    productDAO = (product) => {
        return {
            id: product.id,
            name: product.name,
            active: product.active,
            materialId: product.materialId,
            originId: product.originId,
            stylesId: product.stylesId,
            brandId: product.brandId,
            materialOrther: product.materialOrther,
            originOrther: product.originOrther,
            stylesOrther: product.stylesOrther,
            brandOrther: product.brandOrther,
            describe: product.describe,
            price: product.price,
            image: product.image,
            userFavoriteIdList: product.userFavoriteIdList,
            productCIdList: product.productCIdList,
            reviewIdList: product.reviewIdList,
            //{"color":"[red,green,blue]","size":"[M,L,XL]"}
            options: product.options,
            categoryId: product.categoryId,
            shopId: product.shopId,
        };
    };
    ////////////////////////////////////
    async findProductById(productId) {
        try {
            const product = await ProductRepository.findById(productId);
            if (product) {
                if (product.active) {
                    return product;
                } else {
                    return 'Product block';
                }
            } else {
                return '404';
            }
        } catch (e) {
            console.error(e.message);
            throw new Error('Error retrieving product');
        }
    }
    ////////////////////////////////////////
    async findProductsByShop_Sorted(shopId, take) {
        try {
            const products = await ProductDetailRepository.findProductByShop_Sorted(shopId, 10);
            if (products) {
                return products;
            } else {
                return 'Fail';
            }
        } catch (e) {
            console.error(e.message);

            return 'Fail';
        }
    }

    async findProductsTopByShop(shopId, listProductsId) {
        try {
            const productsHot = await ProductRepository.findTopProductsByShop(shopId, listProductsId);
            if (productsHot) {
                return productsHot;
            } else {
                return 'Fail';
            }
        } catch (e) {
            console.error(e.message);

            return 'Fail';
        }
    }
    async findProduct(take) {
        try {
            console.log(take);
            const products = await ProductDetailRepository.findProduct(take);
            if (products) {
                return products;
            } else {
                return 'Fail';
            }
        } catch (e) {
            console.error(e.message);

            return 'Fail';
        }
    }
    async findProductByName(req) {
        try {
            const product = await ProductRepository.findProductByName(req.body.name, req.body.take);
            if (product) {
                return product;
            } else {
                return 'Fail';
            }
        } catch {
            return 'Fail';
        }
    }
    async findProductSimilar(productId, take) {
        try {
            const productCurrent = await ProductRepository.find(productId);
            if (productCurrent) {
                const productsSimilar = await ProductRepository.findProductSimilar(
                    productCurrent.categoryId,
                    productCurrent.shopId,
                    productId,
                    take,
                );
                return productsSimilar;
            } else {
                return 'Fail';
            }
        } catch (e) {
            console.log(e.message);
            return 'Fail';
        }
    }

    async findKeywordHot(limit) {
        const logFilePath = path.join(process.cwd(), 'search.log');

        if (logFilePath) {
            try {
                let keywords = [];
                const data = await fs.readFile(logFilePath, 'utf8'); // Đọc file log với await
                const keywordCounts = {};
                // Phân tích
                const logs = data
                    .split('\n')
                    .map((line) => line.trim())
                    .filter((line) => line !== '');

                logs.forEach((line) => {
                    const log = JSON.parse(line);
                    const keyword = log.message.match(/User searched for: (.+)/)[1].trim(); // Lấy từ khóa

                    if (keyword) {
                        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1; // Đếm
                    }
                });
                const sortedKeywords = Object.entries(keywordCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, limit);
                sortedKeywords.forEach(([keyword, count]) => {
                    keywords.push({ keyword, count });
                });
                console.log(keywords);
                return keywords;
            } catch (err) {
                console.error('Error reading log file:', err);
                return [];
            }
        } else {
            return [];
        }
    }

    async findProductTop() {
        try {
            const productsTop = await ProductRepository.findProductTop();
            if (productsTop) {
                return productsTop;
            } else {
                return 'Fail';
            }
        } catch (e) {
            console.error(e.message);
            return 'Fail';
        }
    }

    async findProductByCategory(categoryId, take) {
        try {
            const products = await ProductRepository.findProductByCategory(categoryId, take);
            if (products) {
                return products;
            } else {
                return 'Fail';
            }
        } catch (e) {
            console.log(e);
            return 'Fail';
        }
    }
}

export default new GuestService();
