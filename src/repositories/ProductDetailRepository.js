import BaseRepository from './BaseRepository.js';

class ProductDetailRepository extends BaseRepository {
    modelName = 'ProductDetail';

    constructor() {
        super();
        this.db = this.prisma.productDetail;
        this.dbProduct = this.prisma.product;
    }
    findByProductId(productId) {
        return this.db.findMany({
            where: { productId: productId },
        });
    }

    async findProductByShop_Sorted(shopId, take) {
        const products = await this.dbProduct.findMany({
            where: {
                shopId: shopId,
            },
            select: {
                id: true, // Chỉ lấy trường listProductDetailId
            },
        });

        const productIdList = products.map((product) => product.id);
        const groupedProductDetails = await this.db.groupBy({
            by: ['productId'], // Nhóm theo productId
            where: {
                productId: {
                    in: productIdList, // Lọc theo danh sách productId
                },
            },
            _sum: {
                numberSold: true, // Tính tổng số lượng đã bán
            },
            orderBy: {
                _sum: {
                    numberSold: 'desc', // Sắp xếp theo tổng số lượng đã bán giảm dần
                },
            },
        });

        return groupedProductDetails;
    }

    async findProduct(take) {
        const products = await this.dbProduct.findMany({
            select: {
                id: true, // Chỉ lấy trường listProductDetailId
            },
        });

        const productIdList = products.map((product) => product.id);
        const groupedProductDetails = await this.db.groupBy({
            by: ['productId'], // Nhóm theo productId
            where: {
                productId: {
                    in: productIdList, // Lọc theo danh sách productId
                },
            },
            _sum: {
                numberSold: true, // Tính tổng số lượng đã bán
            },
            orderBy: {
                _sum: {
                    numberSold: 'desc', // Sắp xếp theo tổng số lượng đã bán giảm dần
                },
            },
            take: take,
        });

        return groupedProductDetails;
    }
}

export default new ProductDetailRepository();
