import httpStatus from 'http-status';
import nodemailer from 'nodemailer';
import md5 from 'md5';
import { isAuth } from '../../middleware/auth.middleware.js';
import UserService from '../../services/user/UserService.js';
import UserRepository from '../../repositories/UserRepository.js';
import { publicUploadFile } from '../../middleware/upload.middleware.js';
import ShopService from '../../services/shop/ShopService.js';

class UserController {
    initRoutes(app) {
        app.get('/user/get-role', isAuth, this.getRole);
        app.get('/user/get-user', isAuth, this.getUser);
        app.post('/user/logout', isAuth, this.logout);
        app.post('/user/update-user-info', isAuth, this.updateUserInfo);
        app.post('/user/update-image', isAuth, this.updateImage);
        app.post('/user/register-shop', isAuth, this.registerShop);
        app.post('/user/update-default-address', isAuth, this.updateDefaultAddress);
        app.post('/user/change-password', isAuth, this.changePassword);
        app.post('/user/change-password-2fa', isAuth, this.changePassword_2fa);
        app.post('/user/follow-shop', isAuth, this.handleFollowShop);
        app.post('/user/un-follow-shop', isAuth, this.handleUnFollowShop);
        app.post('/user/favorite-product', isAuth, this.handleFavoriteProduct);
        app.post('/user/un-favorite-product', isAuth, this.handleUnFavoriteProduct);
    }
    async handleUnFavoriteProduct(req, res) {
        try {
            const resFavorite = await UserService.unFavoriteProduct(req, req.body.productId);
            if (resFavorite != 'Fail') {
                return res.status(httpStatus.OK).json({ message: 'Success', user: resFavorite.user });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async handleFavoriteProduct(req, res) {
        try {
            const resFavorite = await UserService.favoriteProduct(req, req.body.productId);
            if (resFavorite != 'Fail') {
                return res.status(httpStatus.OK).json({ message: 'Success', user: resFavorite.user });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async handleUnFollowShop(req, res) {
        try {
            const resFollow = await UserService.unFollowShop(req, req.body.shopId);
            if (resFollow != 'Fail') {
                return res
                    .status(httpStatus.OK)
                    .json({ message: 'Success', user: resFollow.user, shop: resFollow.shop });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async handleFollowShop(req, res) {
        try {
            const resFollow = await UserService.followShop(req, req.body.shopId);
            if (resFollow != 'Fail') {
                return res
                    .status(httpStatus.OK)
                    .json({ message: 'Success', user: resFollow.user, shop: resFollow.shop });
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async changePassword(req, res) {
        try {
            const resChangePassword = await UserService.changePassword(req);
            if (resChangePassword == 'Fail') {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            } else if (resChangePassword == 'Incorrect password') {
                return res.status(httpStatus.OK).json({ message: 'Incorrect password' });
            } else {
                const fiveMinutesFromNow = new Date(new Date().getTime() + 5 * 60 * 1000);
                const randomOTP = Math.floor(100000 + Math.random() * 900000);
                await UserRepository.update(req.user.id, { code: randomOTP, codeExpiry: fiveMinutesFromNow });
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'chauthuanphat10@gmail.com',
                        pass: process.env.GOOGLE_PASS,
                    },
                });
                const mailOptions = {
                    from: 'chauthuanphat10@gmail.com',
                    to: req.body.email,
                    subject: 'Your OTP ',
                    text: String(randomOTP),
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
                    } else {
                        return res.status(200).json({ message: 'Email sent successfully' });
                    }
                });
            }
        } catch (e) {
            console.log(e.message);
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async changePassword_2fa(req, res) {
        try {
            const resChangePassword2Fa = await UserService.changePassword_2fa(req);
            if (resChangePassword2Fa == 'Code expiry') {
                return res.status(httpStatus.OK).json({ message: 'Code expiry' });
            } else if (resChangePassword2Fa == 'Fail') {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            } else {
                return res.status(httpStatus.OK).json({ message: 'Success', user: resChangePassword2Fa });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async updateDefaultAddress(req, res) {
        try {
            const resUpdate = await UserRepository.update(req.user.id, { defaultAddressId: req.body.addressId });
            if (resUpdate) {
                const resUser = await UserService.getUser(req.user.email);
                if (resUser != 'Fail') {
                    return res.status(httpStatus.OK).json({ message: 'Success', user: resUser });
                } else {
                    return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
                }
            } else {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
        } catch (e) {
            console.log(e.message);
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async registerShop(req, res) {
        try {
            const resRegisterShop = await ShopService.register(req);
            console.log(resRegisterShop);
            if (resRegisterShop == 'Fail') {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            } else if (resRegisterShop == 'Shop name already exits') {
                return res.status(httpStatus.CONFLICT).json({ message: 'Shop name already exits' });
            } else if (resRegisterShop == 'User already exits') {
                return res.status(httpStatus.CONFLICT).json({ message: 'User already exits' });
            } else {
                return res.status(httpStatus.OK).json({ message: 'Success Shop Create', shopId: resRegisterShop.id });
            }
        } catch {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async updateImage(req, res) {
        try {
            publicUploadFile(req, res, async function (err) {
                if (err) {
                    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Fail' });
                }
                if (req.file) {
                    req.body.image = req.file.path.slice(req.file.path.indexOf('uploads'));
                }
                const resUser = await UserRepository.update(req.user.id, { image: req.body.image });
                return res.status(httpStatus.OK).json({ message: 'Success', user: resUser });
            });
        } catch {
            return res.status(httpStatus.OK).json({ message: 'Success', user: resUser });
        }
    }
    async updateUserInfo(req, res) {
        const resUser = await UserService.updateUserInfo(req);
        if (resUser == 'Fail') {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        } else {
            return res.status(httpStatus.OK).json({ message: 'Success', user: resUser });
        }
    }
    async logout(req, res) {
        try {
            await UserRepository.update(req.user.id, { refreshToken: '' });
            return res.status(httpStatus.OK).json({ message: 'Success' });
        } catch (e) {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async getRole(req, res) {
        try {
            return res.status(httpStatus.OK).json({ message: 'Success', role: req.user.role });
        } catch (e) {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Get role fail' });
        }
    }

    async getUser(req, res) {
        try {
            const user = await UserService.getUser(req.user.email);
            if (user == 'Fail') {
                return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
            }
            return res.status(httpStatus.OK).json({ message: 'Success', user });
        } catch (e) {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
}
export default new UserController();
