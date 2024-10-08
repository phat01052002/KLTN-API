import AddDataController from "../controllers/admin/data/AddDataController.js";
import AuthController from "../controllers/auth/AuthController.js";
import UserController from "../controllers/user/UserController.js";

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
}
