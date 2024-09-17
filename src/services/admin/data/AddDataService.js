import CategoryRepository from "../../../repositories/CategoryRepository.js";

class AddDataService {
    async saveCategory(req) {
        try {
            await CategoryRepository.save(req)
            return 'Success';
        } catch (e) {
            return 'Fail';
        }
    }

    async saveMaterial(req) {
        try {
            await CategoryRepository.save(req)
            return 'Success';
        } catch (e) {
            return 'Fail';
        }
    }

    async saveStyles(req) {
        try {
            await CategoryRepository.save(req)
            return 'Success';
        } catch (e) {
            return 'Fail';
        }
    }

    async saveBrand(req) {
        try {
            await CategoryRepository.save(req)
            return 'Success';
        } catch (e) {
            return 'Fail';
        }
    }

    async saveOrigin(req) {
        try {
            await CategoryRepository.save(req)
            return 'Success';
        } catch (e) {
            return 'Fail';
        }
    }
}
export default new AddDataService();
