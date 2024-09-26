import md5 from 'md5';
import jsonwebtoken from 'jsonwebtoken';
import axios from 'axios';
import UserRepository from '../../repositories/UserRepository.js';

class AuthService {
    async register(req) {
        try {
            const user = await UserRepository.findByPhone(req.body.phone);
            if (user) {
                return 'Account have already exist';
            }
            //init data
            req.body.password = md5(req.body.password);
            //
            await UserRepository.save(req);
            return 'Success';
        } catch {
            return 'Fail';
        }
    }

    async login(phone, password) {
        try {
            const user = await UserRepository.findUserByPhoneAndPassword(phone, md5(password));
            if (user) {
                if (user.active === 'ACTIVE') {
                    const token = await this.signToken(user.phone);
                    return token;
                }
                return 'Account is inActive';
            }
            return 'Phone or password is incorrect';
        } catch (e) {
            console.log(e.message);
            return 'Fail';
        }
    }

    async signToken(phone) {
        const token = jsonwebtoken.sign({ phone: phone }, process.env.TOKEN_SECRET, {
            expiresIn: 60 * 600,
        });
        return token;
    }

    async isAdmin(req) {
        if (req.user.role == 'ADMIN') {
            return true;
        }
        return false;
    }
}

export default new AuthService();
