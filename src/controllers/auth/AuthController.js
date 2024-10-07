import httpStatus from 'http-status';
import md5 from 'md5';
import AuthService from '../../services/auth/AuthService.js';

class AuthController {
    initRoutes(app) {
        app.post('/auth/login', this.login);
        app.post('/auth/register', this.register);
        app.post('/auth/forget-password', this.forgetPassword);
    }

    async forgetPassword(req, res) {
        try {
        } catch (e) {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Fail' });
        }
    }
    async register(req, res) {
        try {
            console.log(req.body);
            const dataRes = await AuthService.register(req);

            if (dataRes == 'Success') {
                return res.status(httpStatus.OK).json({ message: 'Account successfully created' });
            } else if (dataRes == 'Account have already exist') {
                return res.status(httpStatus.CONFLICT).json({ message: 'Account have already exist' });
            } else {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Account creation fail ' });
            }
        } catch (e) {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Account creation fail' });
        }
    }

    async login(req, res) {
        try {
            const dataRes = await AuthService.login(req.body.phone, req.body.password);
            if (dataRes == 'Phone or password is incorrect') {
                return res.status(httpStatus.OK).json({ message: 'Phone or password is incorrect' });
            }
            if (dataRes == 'Account is inActive') {
                return res.status(httpStatus.OK).json({ message: 'Account is inActive' });
            }
            return res.status(httpStatus.OK).json({ message: 'Login success', accessToken: dataRes });
        } catch (e) {
            return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Login Fail' });
        }
    }
}

export default new AuthController();
