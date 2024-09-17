import BaseRepository from './BaseRepository.js';

class CategoryRepository extends BaseRepository {
    modelName = 'Category';

    constructor() {
        super();
        this.db = this.prisma.category;
    }

}

export default new CategoryRepository();
