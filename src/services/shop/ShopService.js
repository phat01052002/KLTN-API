import ShopRepository from '../../repositories/ShopRepository.js';
import UserRepository from '../../repositories/UserRepository.js';

class ShopService {
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
}
export default new ShopService();
