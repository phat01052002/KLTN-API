import BaseRepository from './BaseRepository.js';

class ProductRepository extends BaseRepository {
    modelName = 'Product';

    constructor() {
        super();
        this.db = this.prisma.product;
        this.dbCategory = this.prisma.category;
        this.defaultSelected = {
            id: true,
            name: true,
            active: true,
            materialId: true,
            originId: true,
            stylesId: true,
            brandId: true,
            materialOrther: true,
            originOrther: true,
            stylesOrther: true,
            brandOrther: true,
            describe: true,
            price: true,
            image: true,
            userFavoriteIdList: true,
            productCIdList: true,
            reviewIdList: true,
            //{"color":"[red,green,blue]","size":"[M,L,XL]"}
            options: true,
            categoryId: true,
            shopId: true,
        };
    }
    findById(id) {
        return this.db.findUnique({
            where: { id: id },
        });
    }
    async findProductByName(name, take) {
        const productByName = await this.db.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            },
            take: take,
        });

        return productByName;
    }

    async findTopProductsByShop(shopId, listProductsId) {
        const productsTop = await this.db.findMany({
            where: {
                shopId: shopId,
                id: {
                    in: listProductsId,
                },
            },
            select: this.defaultSelected,
        });
        return productsTop;
    }

    async findProductSimilar(categoryId, shopId, productId, take) {
        return await this.db.findMany({
            where: {
                shopId: shopId,
                categoryId: categoryId,
                id: {
                    not: productId, //this is !=
                },
            },
            take: take,
            select: this.defaultSelected,
        });
    }
}

export default new ProductRepository();
