import ProductRepository from '../../repositories/ProductRepository.js';
import ShopRepository from '../../repositories/ShopRepository.js';
import UserRepository from '../../repositories/UserRepository.js';
import md5 from 'md5';

class UserService {
    /////////////////////////
    userDAO = (user) => {
        return {
            id: user.id,
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
    };
    shopDAO = (shop) => {
        return {
            id: shop.id,
            name: shop.name,
            image: shop.image,
            describeShop: shop.describeShop,
            addressShop: shop.addressShop,
            phoneShop: shop.phoneShop,
            userFollowIdList: shop.userFollowIdList,
            productIdList: shop.productIdList,
            orderIdList: shop.orderIdList,
            bannerIdList: shop.bannerIdList,
            discountIdList: shop.discountIdList,
            userId: shop.userId,
        };
    };
    //////////////////////////
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
                        return this.userDAO(resUpdate);
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
                return this.userDAO(user);
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
                return this.userDAO(new_user);
            }
        } catch {
            return 'Fail';
        }
    }

    async followShop(req, shopId) {
        try {
            const shop = await ShopRepository.find(shopId);
            if (shop && !shop.userFollowIdList.includes(req.user.id)) {
                const shop_new = await ShopRepository.update(shopId, {
                    userFollowIdList: [...shop.userFollowIdList, req.user.id],
                });
                const user_new = await UserRepository.update(req.user.id, {
                    shopFollowIdList: [...req.user.shopFollowIdList, shopId],
                });
                if (shop_new && user_new)
                    return {
                        user: this.userDAO(user_new),
                        shop: this.shopDAO(shop_new),
                    };
            } else {
                return 'Fail';
            }
        } catch (e) {
            return 'Fail';
        }
    }

    async unFollowShop(req, shopId) {
        try {
            const shop = await ShopRepository.find(shopId);
            if (shop && shop.userFollowIdList.includes(req.user.id)) {
                const new_list_shop = shop.userFollowIdList.filter((item) => item !== req.user.id);
                const shop_new = await ShopRepository.update(shopId, {
                    userFollowIdList: new_list_shop,
                });
                const new_list_user = req.user.shopFollowIdList.filter((item) => item !== shopId);
                const user_new = await UserRepository.update(req.user.id, {
                    shopFollowIdList: new_list_user,
                });
                if (shop_new && user_new)
                    return {
                        user: this.userDAO(user_new),
                        shop: this.shopDAO(shop_new),
                    };
            } else {
                return 'Fail';
            }
        } catch (e) {
            console.log(e.message);
            return 'Fail';
        }
    }
    async favoriteProduct(req, productId) {
        try {
            const product = await ProductRepository.find(productId);
            if (product && !product.userFavoriteIdList.includes(req.user.id)) {
                const product_new = await ProductRepository.update(productId, {
                    userFavoriteIdList: [...product.userFavoriteIdList, req.user.id],
                });
                const user_new = await UserRepository.update(req.user.id, {
                    productFavoriteIdList: [...req.user.productFavoriteIdList, productId],
                });
                if (product_new && user_new)
                    return {
                        user: this.userDAO(user_new),
                    };
            } else {
                return 'Fail';
            }
        } catch {
            return 'Fail';
        }
    }

    async unFavoriteProduct(req, productId) {
        try {
            const product = await ProductRepository.find(productId);
            if (product && product.userFavoriteIdList.includes(req.user.id)) {
                const new_list_product = product.userFavoriteIdList.filter((item) => item !== req.user.id);
                const product_new = await ProductRepository.update(productId, {
                    userFavoriteIdList: new_list_product,
                });
                const new_list_user = req.user.productFavoriteIdList.filter((item) => item !== productId);
                const user_new = await UserRepository.update(req.user.id, {
                    productFavoriteIdList: new_list_user,
                });
                if (product_new && user_new)
                    return {
                        user: this.userDAO(user_new),
                    };
            } else {
                return 'Fail';
            }
        } catch (e) {
            console.log(e.message);
            return 'Fail';
        }
    }
}
export default new UserService();
