import httpStatus from 'http-status';
import nodemailer from 'nodemailer';
import md5 from 'md5';
import { isAuth } from '../../middleware/auth.middleware.js';
import UserService from '../../services/UserService.js';
import UserRepository from '../../repositories/UserRepository.js';
class UserController {
    initRoutes(app) {
        app.get('/user/get-role', isAuth, this.getRole);
        app.get('/user/get-user', isAuth, this.getUser);
        app.get('/user/test', this.send);
        app.post('/user/logout', isAuth, this.logout);
        app.post('/user/update-user-info', isAuth, this.updateUserInfo);
    }
    async send(req, res) {}
    
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
