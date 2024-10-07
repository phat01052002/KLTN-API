import UserRepository from '../repositories/UserRepository.js';

class UserService {
    async getUser(phone) {
        try {
            const user = await UserRepository.findByPhone(phone);
            if (user) {
                return {
                    phone: user.phone,
                    name: user.name,
                    image: user.image,
                    email: user.email,
                    sex: user.sex,
                    birthDay: user.birthDay,
                    role: user.role,
                    rank: user.rank,
                    point: user.point,
                    addressIdList: user.addressIdList,
                    orderIdList: user.orderIdList,
                    reviewIdList: user.reviewIdList,
                    shopFollowIdList: user.shopFollowIdList,
                    productFavoriteIdList: user.productFavoriteIdList,
                    notificationIdList: user.notificationIdList,
                    reportIdList: user.reportIdList,
                    shopId: user.shopId,
                };
            }
        } catch (e) {
            return 'Fail';
        }
    }
}
export default new UserService();
