import ProductRepository from '../repositories/ProductRepository.js';

class GuestService {
    async findProductById(productId) {
        try {
            const product = await ProductRepository.find(productId);
            if (product) {
                if (product.active) {
                    return {
                        id: product.id,
                        name: product.name,
                        active: product.active,
                        materialId: product.materialId,
                        originlId: product.originlId,
                        stylelId: product.stylelId,
                        brandlId: product.brandlId,
                        materialOrther: product.materialOrther,
                        originlOrther: product.originlOrther,
                        stylelOrther: product.stylelOrther,
                        brandlOrther: product.brandlOrther,
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
                    }; // Trả về sản phẩm tìm thấy
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
}

export default new GuestService();
