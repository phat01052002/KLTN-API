import ShopRepository from '../../repositories/ShopRepository.js';
import UserRepository from '../../repositories/UserRepository.js';

class ShopService {
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
    async register(req) {
        try {
            if (req.user.shopId) {
                return 'User already exits ';
            }
            const shop = await ShopRepository.findByName(req.body.name);
            if (shop) {
                return 'Shop name already exits';
            }
            req.body.userId = req.user.id;
            const resRegisterShop = await ShopRepository.save(req);
            const resUpdateUser = await UserRepository.update(req.user.id, {
                role: 'SHOP',
                shopId: resRegisterShop.id,
            });
            if (resRegisterShop && resUpdateUser) {
                return resRegisterShop;
            } else {
                return 'Fail';
            }
        } catch (e) {
            console.log(e.message);
        }
    }
    async get(shopId) {
        try {
            const shop = await ShopRepository.find(shopId);
            if (shop) {
                return this.shopDAO(shop);
            } else {
                return 'Fail';
            }
        } catch (e) {
            return 'Fail';
        }
    }
}
export default new ShopService();
