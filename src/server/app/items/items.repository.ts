import { Response } from 'express';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { Database } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';

export class ItemsRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async create(res: Response, userId: number, uId: string, title: string, description: string): Promise<ItemViewModel> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.create,
            {
                userId,
                uId,
                title,
                description
            }
        );

        const model = result.records.map(x => {
            let viewModel = new ItemViewModel();
            viewModel = Database.createNodeObject(x.get('item'));
            viewModel.user = Database.parseValues(x.get('user'));
            return viewModel;
        }) as ItemViewModel[];

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async update(res: Response, userId: number): Promise<any> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.update,
            {
                userId
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as any[];

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async get(res: Response, userId: number, uId: string): Promise<ItemViewModel> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.get,
            {
                userId,
                uId
            }
        );

        const model = result.records.map(x => {
            let viewModel = new ItemViewModel();
            viewModel = Database.createNodeObject(x.get('item'));
            viewModel.user = Database.parseValues(x.get('user'));
            return viewModel;
        }) as ItemViewModel[];

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async getAll(res: Response, userId: number, pageIndex: number, pageSize: number): Promise<ItemViewModel[]> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.getAll,
            {
                userId,
                pageIndex,
                pageSize
            }
        );

        const model = result.records.map(x => {
            let viewModel = new ItemViewModel();
            viewModel = Database.createNodeObject(x.get('items'));
            viewModel.user = Database.parseValues(x.get('users'));
            return viewModel;
        }) as ItemViewModel[];

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    public async delete(res: Response, userId: number, uId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.items.delete,
            {
                userId,
                uId
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }
}



declare global {
    namespace Express {
        interface Response {
            locals?: {
                test: string;
            };
        }
    }
}
