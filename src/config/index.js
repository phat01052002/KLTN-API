import AddDataController from "../controllers/admin/data/AddDataController.js";
import AuthController from "../controllers/auth/AuthController.js";
import ProvinceController from "../controllers/ProvinceController.js";
import AddressController from "../controllers/user/AddressController.js";
import UserController from "../controllers/user/UserController.js";
import GuestController from "../controllers/guest/GuestController.js";
export function initApplication(app) {
    BigInt.prototype.toJSON = function () {
        return this.toString();
    };

    initRoutes(app);
    //Scheduled.initJobs();
}
export function initRoutes(app) {
    AddDataController.initRoutes(app);
    AuthController.initRoutes(app)
    UserController.initRoutes(app)
    GuestController.initRoutes(app)
    ProvinceController.initRoutes(app);
    AddressController.initRoutes(app);
}
