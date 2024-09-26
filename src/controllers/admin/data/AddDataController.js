import { isAuth } from '../../../middleware/auth.middleware.js';
import AddDataService from '../../../services/admin/data/AddDataService.js';
import AuthService from '../../../services/auth/AuthService.js';
import httpStatus from 'http-status';

class AddDataController {
    initRoutes(app) {
        app.post('/admin/add/category', isAuth, this.addCategory);
    }

    async addCategory(req, res) {
        try {
            if (AuthService.isAdmin(req)) {
                const projects = await AddDataService.saveCategory(req);
                return res.status(httpStatus.OK).json(projects);
            } else {
                return res.status(httpStatus.FORBIDDEN).json({ message: 'Fail' });
            }
        } catch (e) {
            console.log(e.message);
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'Fail' });
        }
    }
    async addOrigin(req, res) {
        try {
            if (this.isAdmin(req)) {
                const projects = await AddDataService.save(req);
                return res.status(httpStatus.OK).json(projects);
            } else {
                return res.status(httpStatus.FORBIDDEN).json({ message: 'Fail' });
            }
        } catch (e) {
            console.log(e.message);
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'Fail' });
        }
    }
    async addMeterial(req, res) {
        try {
            if (this.isAdmin(req)) {
                const projects = await AddDataService.save(req);
                return res.status(httpStatus.OK).json(projects);
            } else {
                return res.status(httpStatus.FORBIDDEN).json({ message: 'Fail' });
            }
        } catch (e) {
            console.log(e.message);
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'Fail' });
        }
    }
    async addStyles(req, res) {
        try {
            if (this.isAdmin(req)) {
                const projects = await AddDataService.save(req);
                return res.status(httpStatus.OK).json(projects);
            } else {
                return res.status(httpStatus.FORBIDDEN).json({ message: 'Fail' });
            }
        } catch (e) {
            console.log(e.message);
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'Fail' });
        }
    }
    async addBrand(req, res) {
        try {
            if (this.isAdmin(req)) {
                const projects = await AddDataService.save(req);
                return res.status(httpStatus.OK).json(projects);
            } else {
                return res.status(httpStatus.FORBIDDEN).json({ message: 'Fail' });
            }
        } catch (e) {
            console.log(e.message);
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'Fail' });
        }
    }
}

export default new AddDataController();
