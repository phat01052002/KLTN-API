import BaseRepository from './BaseRepository.js';

class ProductRepository extends BaseRepository {
    modelName = 'Product';

    constructor() {
        super();
        this.db = this.prisma.product;
        this.dbCategory = this.prisma.category;
        this.dbProductDetail = this.prisma.productDetail;
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
    async getSoldAndDiscount(products, groupedProductDetails, discountDetails) {
        if (groupedProductDetails && products && discountDetails) {
            products.map((product, index) => {
                //
                const indices = discountDetails.reduce((acc, item, index) => {
                    if (item.productId === product.id && item.discountId != null) {
                        acc.push(item.discountId);
                    }
                    return acc;
                }, []);
                if (indices.length > 0) {
                    product.discountIdList = [];
                    indices.map((discountId) => {
                        product.discountIdList = [...product.discountIdList, discountId];
                    });
                }
                //
                const productIndex = groupedProductDetails.findIndex((item) => item.productId === product.id);
                if (productIndex != -1) {
                    product.numberSold = groupedProductDetails[productIndex]._sum.numberSold;
                }
                //
            });
            return products;
        }
    }
    async findById(id) {
        //sold
        const groupedProductDetails = await this.dbProductDetail.groupBy({
            by: ['productId'],
            where: {
                productId: id,
            },
            _sum: {
                numberSold: true,
            },
            orderBy: {
                _sum: {
                    numberSold: 'desc',
                },
            },
        });
        //discount
        const discountDetails = await this.dbProductDetail.findMany({
            where: {
                productId: id,
            },
            select: {
                id: true,
                productId: true,
                discountId: true,
            },
        });
        //
        const product = await this.db.findUnique({
            where: { id: id },
            select: this.defaultSelected,
        });
        //
        if (product && groupedProductDetails) {
            //
            const indices = discountDetails.reduce((acc, item, index) => {
                if (item.productId === product.id && item.discountId != null) {
                    acc.push(item.discountId);
                }
                return acc;
            }, []);
            if (indices.length > 0) {
                product.discountIdList = [];
                indices.map((discountId) => {
                    product.discountIdList = [...product.discountIdList, discountId];
                });
            }
            //
            if (groupedProductDetails.length > 0) {
                product.numberSold = groupedProductDetails[0]._sum.numberSold;
            }
            return product;
        }
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
        //number sold
        const groupedProductDetails = await this.dbProductDetail.groupBy({
            by: ['productId'],
            where: {
                productId: {
                    in: listProductsId,
                },
            },
            _sum: {
                numberSold: true,
            },
            orderBy: {
                _sum: {
                    numberSold: 'desc',
                },
            },
        });
        // discount
        const discountDetails = await this.dbProductDetail.findMany({
            where: {
                productId: {
                    in: listProductsId,
                },
            },
            select: {
                id: true,
                productId: true,
                discountId: true,
            },
        });
        //products
        const products = await this.db.findMany({
            where: {
                shopId: shopId,
                id: {
                    in: listProductsId,
                },
            },
            select: this.defaultSelected,
        });
        //
        const res = await this.getSoldAndDiscount(products, groupedProductDetails, discountDetails);
        return res;
    }

    async findProductSimilar(categoryId, shopId, productId, take) {
        const products = await this.db.findMany({
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
        const productIds = products.map((item) => item.id);
        /////////////////
        //number sold
        const groupedProductDetails = await this.dbProductDetail.groupBy({
            by: ['productId'],
            where: {
                productId: {
                    in: productIds,
                },
            },
            _sum: {
                numberSold: true,
            },
            orderBy: {
                _sum: {
                    numberSold: 'desc',
                },
            },
        });
        // discount
        const discountDetails = await this.dbProductDetail.findMany({
            where: {
                productId: {
                    in: productIds,
                },
            },
            select: {
                id: true,
                productId: true,
                discountId: true,
            },
        });
        const res = await this.getSoldAndDiscount(products, groupedProductDetails, discountDetails);
        return res;
    }

    async findProductTop() {
        //find by numberSold
        const groupedProductDetails = await this.dbProductDetail.groupBy({
            by: ['productId'],
            _sum: {
                numberSold: true,
            },
            orderBy: {
                _sum: {
                    numberSold: 'desc',
                },
            },
            take: 24,
        });
        const productIds = groupedProductDetails.map((item) => item.productId);
        //find product
        const products = await this.db.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
            select: this.defaultSelected,
        });
        // discount
        const discountDetails = await this.dbProductDetail.findMany({
            where: {
                productId: {
                    in: productIds,
                },
            },
            select: {
                id: true,
                productId: true,
                discountId: true,
            },
        });
        const res = await this.getSoldAndDiscount(products, groupedProductDetails, discountDetails);
        return res;
    }

    async findProductByCategory(categoryId, take) {
        //get category
        // //products
        // const products = await this.db.findMany({
        //     where: {
        //         categoryId: categoryId,
        //     },
        //     select: this.defaultSelected,
        //     take: parseInt(take),
        // });
        // const productIds = products.map((item) => item.id);
        // //number sold
        // const groupedProductDetails = await this.dbProductDetail.groupBy({
        //     by: ['productId'],
        //     where: {
        //         productId: {
        //             in: productIds,
        //         },
        //     },
        //     _sum: {
        //         numberSold: true,
        //     },
        //     orderBy: {
        //         _sum: {
        //             numberSold: 'desc',
        //         },
        //     },
        // });
        // // discount
        // const discountDetails = await this.dbProductDetail.findMany({
        //     where: {
        //         productId: {
        //             in: productIds,
        //         },
        //     },
        //     select: {
        //         id: true,
        //         productId: true,
        //         discountId: true,
        //     },
        // });
        // //
        // const res = await this.getSoldAndDiscount(products, groupedProductDetails, discountDetails);
        // return res;
    }
}

export default new ProductRepository();
