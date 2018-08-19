import { Response } from 'express';

export abstract class BaseService {
    protected getUserId(res: Response): number {
        const user = res.locals.user;
        if (user) {
            return +user.i; // alias for id to keep payload light
        } else {
            return null;
        }
    }
}
