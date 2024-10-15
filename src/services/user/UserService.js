import UserRepository from '../../repositories/UserRepository.js';
import md5 from 'md5';

class UserService {
    async changePassword(req) {
        try {
            if (req.user.password == md5(req.body.passwordOld)) {
                return 'Let sent otp';
            } else {
                return 'Incorrect password';
            }
        } catch {
            return 'Fail';
        }
    }
    async changePassword_2fa(req) {
        try {
            const user = await UserRepository.findByEmail(req.user.email);
            if (user.codeExpiry > new Date().getTime()) {
                if (req.body.code == String(user.code)) {
                    const resUpdate = await UserRepository.update(req.user.id, {
                        password: md5(req.body.passwordNew),
                        codeExpiry: new Date().getTime(),
                    });
                    if (resUpdate) {
                        return {
                            phone: resUpdate.phone,
                            name: resUpdate.name,
                            image: resUpdate.image,
                            email: resUpdate.email,
                            sex: resUpdate.sex,
                            birthDay: resUpdate.birthDay,
                            role: resUpdate.role,
                            defaultAddressId: resUpdate.defaultAddressId,
                            rank: resUpdate.rank,
                            point: resUpdate.point,
                            addressIdList: resUpdate.addressIdList,
                            orderIdList: resUpdate.orderIdList,
                            reviewIdList: resUpdate.reviewIdList,
                            shopFollowIdList: resUpdate.shopFollowIdList,
                            productFavoriteIdList: resUpdate.productFavoriteIdList,
                            notificationIdList: resUpdate.notificationIdList,
                            reportIdList: resUpdate.reportIdList,
                            shopId: resUpdate.shopId,
                        };
                    } else {
                        return 'Fail';
                    }
                }
            } else {
                return 'Code expiry';
            }
        } catch (e) {
            return 'Fail';
        }
    }
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
                    defaultAddressId: user.defaultAddressId,
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
