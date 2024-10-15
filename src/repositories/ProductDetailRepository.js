import BaseRepository from './BaseRepository.js';

class ProductDetailRepository extends BaseRepository {
    modelName = 'ProductDetail';

    constructor() {
        super();
        this.db = this.prisma.productDetail;
    }
    findByProductId(productId) {
        return this.db.findMany({
            where: { productId: productId },
        });
    }
}

export default new ProductDetailRepository();
