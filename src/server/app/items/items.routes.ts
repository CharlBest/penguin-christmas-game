import { ItemRoutes } from '../../../shared/routes/item.routes';
import { Authentication } from '../../core/middleware/authentication';
import { BaseRoute } from '../shared/base-route';
import { ItemsController } from './items.controller';

export class ItemsRoutes extends BaseRoute {
    itemsController: ItemsController;

    constructor() {
        super();
        this.itemsController = new ItemsController();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post(ItemRoutes.create().server(), Authentication.loginRequired,
            async (req, res, next) => this.itemsController.create(req, res, next).catch(next));
        this.router.put(ItemRoutes.update().server(), Authentication.loginRequired,
            async (req, res, next) => this.itemsController.update(req, res, next).catch(next));
        this.router.delete(ItemRoutes.delete().server(), Authentication.loginRequired,
            async (req, res, next) => this.itemsController.delete(req, res, next).catch(next));
        this.router.post(ItemRoutes.createFavourite().server(), Authentication.loginRequired,
            async (req, res, next) => this.itemsController.createFavourite(req, res, next).catch(next));
        this.router.delete(ItemRoutes.deleteFavourite().server(), Authentication.loginRequired,
            async (req, res, next) => this.itemsController.deleteFavourite(req, res, next).catch(next));
        this.router.get(ItemRoutes.getAllFavourites().server(), Authentication.loginRequired,
            async (req, res, next) => this.itemsController.getAllFavourites(req, res, next).catch(next));
        this.router.post(ItemRoutes.createComment().server(), Authentication.loginRequired,
            async (req, res, next) => this.itemsController.createComment(req, res, next).catch(next));
        this.router.put(ItemRoutes.updateComment().server(), Authentication.loginRequired,
            async (req, res, next) => this.itemsController.updateComment(req, res, next).catch(next));
        this.router.delete(ItemRoutes.deleteComment().server(), Authentication.loginRequired,
            async (req, res, next) => this.itemsController.deleteComment(req, res, next).catch(next));

        this.router.get(ItemRoutes.get().server(),
            async (req, res, next) => this.itemsController.get(req, res, next).catch(next));
        this.router.get(ItemRoutes.getAll().server(),
            async (req, res, next) => this.itemsController.getAll(req, res, next).catch(next));
        this.router.get(ItemRoutes.getComments().server(),
            async (req, res, next) => this.itemsController.getComments(req, res, next).catch(next));
    }
}
