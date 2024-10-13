import BaseRepository from './BaseRepository.js';

class ProductRepository extends BaseRepository {
    modelName = 'Product';

    constructor() {
        super();
        this.db = this.prisma.product;
    }
    findById(id) {
        return this.db.findUnique({
            where: { id: id },
        });
    }
}

export default new ProductRepository();