import BaseRepository from './BaseRepository.js';

class UserRepository extends BaseRepository {
    modelName = 'User';

    constructor() {
        super();
        this.db = this.prisma.user;
    }

    findByPhone(phone){
        return this.db.findUnique({
            where: { phone: phone },
        });
    }

    findUserByPhoneAndPassword(phone, password) {
        return this.db.findUnique({
            where: { phone: phone, password: password },
        });
    }
}

export default new UserRepository();
