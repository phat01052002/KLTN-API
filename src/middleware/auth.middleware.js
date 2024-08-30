import httpStatus from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';

const apiKeyCheck = (req) => {
    if (
        process.env.OPEN_API_KEY &&
        process.env.OPEN_API_KEY === req.query.apiKey &&
        (req.path.indexOf('/user') === 0 ||
            req.path.indexOf('/auth') === 0 ||
            req.path.indexOf('/project') === 0 ||
            req.path.indexOf('/project-news') === 0 ||
            /\/user\/+[0-9]+/gm.test(req.path) ||
            /\/auth\/+[0-9]+/gm.test(req.path) ||
            /\/project\/+[0-9]+/gm.test(req.path) ||
            /\/project-news\/+[0-9]+/gm.test(req.path))
    ) {
        return true;
    }

    return false;
};

export const isAuth = async (req, res, next) => {
    if (apiKeyCheck(req)) {
        return next();
    }
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: httpStatus[401] });
    }

    const token = authHeader && authHeader.split(' ')[1];

    try {
        const verified = await jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
        console.log(verified);

        if (!verified) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: httpStatus['401_MESSAGE'] });
        }

        req.user = await UserRepository.getUserByPhone(verified.phone);

        return next();
    } catch (err) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: httpStatus['401_MESSAGE'] });
    }
};
