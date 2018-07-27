import { Response } from 'express';
import { UserCardModel } from '../../../shared/models/user/user-card.model';
import { UserLiteModel } from '../../../shared/models/user/user-lite.model';
import { UserModel } from '../../../shared/models/user/user.model';
import { DoesUsernameAndEmailExist } from '../../../shared/view-models/create-user/does-username-and-email-exist.view-model';
import { CompletedTutorial } from '../../../shared/view-models/tutorial/completed-tutorial.view-model';
import { Database, DbQueries } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';

export class UsersRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async createUser(res: Response, uId: string, email: string, username: string, password: string, passwordSalt: string, emailCode: string): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.createUser,
            {
                uId,
                email,
                username,
                password,
                passwordSalt,
                emailCode
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async doesUsernameAndEmailExist(res: Response, email: string, username: string): Promise<DoesUsernameAndEmailExist> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.doesUsernameAndEmailExist,
            {
                email,
                username
            }
        );

        const model = result.records.map(x => {
            const localModel = new DoesUsernameAndEmailExist();
            localModel.emailExist = x.get('emailExist');
            localModel.usernameExist = x.get('usernameExist');
            return localModel;
        });

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async getLiteUserByEmailOrUsername(res: Response, emailOrUsername: string): Promise<UserLiteModel> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.getLiteUserByEmailOrUsername,
            {
                emailOrUsername
            }
        );

        const model = result.records.map(x => Database.parseValues(x.get('user'))) as UserLiteModel[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async getLiteUserById(res: Response, userId: number): Promise<UserLiteModel> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.getLiteUserById,
            {
                userId
            }
        );

        const model = result.records.map(x => Database.parseValues(x.get('user'))) as UserLiteModel[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async getUserById(res: Response, userId: number): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.getUserById,
            {
                userId
            }
        );

        const model = result.records.map(x => {
            let localModel = new UserModel();
            localModel = Database.createNodeObject(x.get('user')) as UserModel;
            localModel.userCards = Database.createNodeObjectArray(x.get('cards')) as UserCardModel[];
            return localModel;
        });

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async forgotPassword(res: Response, email: string, code: string): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.addForgottenPasswordCode,
            {
                email,
                code
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async changeForgottenPassword(res: Response, email: string, code: string, password: string, passwordSalt: string): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.changeForgottenPassword,
            {
                email,
                code,
                password,
                passwordSalt
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async verifyEmail(res: Response, userId: number, code: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.verifyEmail,
            {
                userId,
                code
            }
        );

        if (result.records.length > 0) {
            return result.records[0].get('userExist');
        } else {
            return null;
        }
    }

    public async updateAvatar(res: Response, userId: number, avatarUrl: string): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.updateAvatar,
            {
                userId,
                avatarUrl
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async updateBio(res: Response, userId: number, bio: string): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.updateBio,
            {
                userId,
                bio
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async updatePassword(res: Response, userId: number, password: string, passwordSalt: string): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.updatePassword,
            {
                userId,
                password,
                passwordSalt
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async deleteUser(res: Response, userId: number): Promise<boolean> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.deleteUser,
            {
                userId
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async completedTutorial(res: Response, userId: number, viewModel: CompletedTutorial): Promise<boolean> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.completedTutorial,
            {
                userId,
                tutorialType: viewModel.tutorialType,
                didSkip: viewModel.didSkip
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async userPayment(res: Response, userId: number, cardUId: string, paymentUId: string, amount: number, chargeId: string, chargeCreated: number): Promise<boolean> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.userPayment,
            {
                userId,
                cardUId,
                paymentUId,
                amount,
                chargeId,
                chargeCreated,
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async userCards(res: Response, userId: number): Promise<UserCardModel[]> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.userCards,
            {
                userId
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('card'))) as UserCardModel[];

        if (model !== null && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    public async createCard(res: Response, userId: number, stripeCustomerId: string, uId: string, stripeCardId: string, last4: string): Promise<UserCardModel> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.createCard,
            {
                userId,
                stripeCustomerId,
                uId,
                stripeCardId,
                last4,
            }
        );

        const model = result.records.map(x => Database.createNodeObject(x.get('card'))) as UserCardModel[];

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async deleteCard(res: Response, userId: number, cardUId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.deleteCard,
            {
                userId,
                cardUId
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async updateDefaultCard(res: Response, userId: number, cardUId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run((<DbQueries>res.app.locals.dbQueries).users.updateDefaultCard,
            {
                userId,
                cardUId
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }
}
