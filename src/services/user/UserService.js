import UserRepository from "../../repositories/UserRepository.js";

class UserService {
    async getUser(email) {
        try {
            const user = await UserRepository.findByEmail(email);
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

    async updateUserInfo(req) {
        try {
            const user = await UserRepository.findByEmail(req.user.email);
            if (user) {
                const new_user = await UserRepository.update(user.id, req.body);
                return {
                    phone: new_user.phone,
                    name: new_user.name,
                    image: new_user.image,
                    email: new_user.email,
                    sex: new_user.sex,
                    birthDay: new_user.birthDay,
                    role: new_user.role,
                    rank: new_user.rank,
                    point: new_user.point,
                    addressIdList: new_user.addressIdList,
                    orderIdList: new_user.orderIdList,
                    reviewIdList: new_user.reviewIdList,
                    shopFollowIdList: new_user.shopFollowIdList,
                    productFavoriteIdList: new_user.productFavoriteIdList,
                    notificationIdList: new_user.notificationIdList,
                    reportIdList: new_user.reportIdList,
                    shopId: new_user.shopId,
                };
            }
        } catch {
            return 'Fail';
        }
    }
}
export default new UserService();
