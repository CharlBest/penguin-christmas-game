import { Response } from 'express';
import { UserLiteModel } from '../../../shared/models/user/user-lite.model';
import { UserModel } from '../../../shared/models/user/user.model';
import { DoesUsernameAndEmailExist } from '../../../shared/view-models/create-user/does-username-and-email-exist.view-model';
import { CompletedTutorial } from '../../../shared/view-models/tutorial/completed-tutorial.view-model';
import { NotificationPreferencesViewModel } from '../../../shared/view-models/user/notification-preferences.view-model';
import { NotificationsViewModel } from '../../../shared/view-models/user/notifications.view-model';
import { PushSubscriptionViewModel } from '../../../shared/view-models/user/push-subscription.view-model';
import { UpdateNotificationPreferencesViewModel } from '../../../shared/view-models/user/update-notification-preferences.view-model';
import { UserPublicViewModel } from '../../../shared/view-models/user/user-public.view-model';
import { BaseRepository } from '../shared/base-repository';

class UsersRepository extends BaseRepository {

    constructor() {
        super();
    }

    async createUser(res: Response, uId: string, email: string, username: string, password: string, passwordSalt: string, emailCode: string)
        : Promise<Pick<UserModel, 'email' | 'username' | 'emailCode'> | null> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.createUser,
            {
                uId,
                email,
                username,
                password,
                passwordSalt,
                emailCode
            }
        );

        const model = result.records.map(x => x.get('user'));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async doesUsernameAndEmailExist(res: Response, email: string, username: string): Promise<DoesUsernameAndEmailExist | null> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.doesUsernameAndEmailExist,
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

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getUserByEmailOrUsername(res: Response, emailOrUsername: string)
        : Promise<Pick<UserModel, 'password' | 'passwordSalt' | 'id'> | null> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.getUserByEmailOrUsername,
            {
                emailOrUsername
            }
        );

        const model = result.records.map(x => x.get('user'));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getLiteUserById(res: Response, userId: number): Promise<UserLiteModel | null> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.getLiteUserById,
            {
                userId
            }
        );

        const model = result.records.map(x => x.get('user'));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getUserById(res: Response, userId: number): Promise<UserModel | null> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.getUserById,
            {
                userId
            }
        );

        const model = result.records.map(x => {
            let localModel = new UserModel();
            localModel = x.get('user');
            localModel.userCards = x.get('cards');
            return localModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getUserPublic(res: Response, loggedInUserId: number | null, ip: string, userId: number, pageIndex: number, pageSize: number)
        : Promise<UserPublicViewModel | null> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.getUserPublic,
            {
                userId,
                loggedInUserId,
                ip,
                pageIndex,
                pageSize
            }
        );

        const model = result.records.map(x => {
            let localModel = new UserPublicViewModel();
            localModel = x.get('user');
            localModel.items = x.get('items');
            return localModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async forgotPassword(res: Response, email: string, code: string): Promise<Pick<UserModel, 'email'> | null> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.addForgottenPasswordCode,
            {
                email,
                code
            }
        );

        const model = result.records.map(x => x.get('user'));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async changeForgottenPassword(res: Response, email: string, code: string, password: string, passwordSalt: string)
        : Promise<Pick<UserModel, 'email'> | null> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.changeForgottenPassword,
            {
                email,
                code,
                password,
                passwordSalt
            }
        );

        const model = result.records.map(x => x.get('user'));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async verifyEmail(res: Response, userId: number, code: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.verifyEmail,
            {
                userId,
                code
            }
        );

        if (result.records.length > 0) {
            return result.records[0].get('userExist');
        } else {
            return false;
        }
    }

    async updateAvatar(res: Response, userId: number, avatarUrl: string | null): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.updateAvatar,
            {
                userId,
                avatarUrl
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async updateBio(res: Response, userId: number, bio: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.updateBio,
            {
                userId,
                bio
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async updatePassword(res: Response, userId: number, password: string, passwordSalt: string): Promise<Pick<UserModel, 'email'> | null> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.updatePassword,
            {
                userId,
                password,
                passwordSalt
            }
        );

        const model = result.records.map(x => x.get('user'));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async deleteUser(res: Response, userId: number): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.deleteUser,
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

    async completedTutorial(res: Response, userId: number, viewModel: CompletedTutorial): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.completedTutorial,
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

    async getNotificationPreferences(res: Response, userId: number): Promise<NotificationPreferencesViewModel | null> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.getNotificationPreferences,
            {
                userId
            }
        );

        const model = result.records.map(x => {
            const localModel = new NotificationPreferencesViewModel(x.get('pushNotificationTypes'), x.get('emailNotificationTypes'));
            localModel.hasPushSubscription = x.get('hasPushSubscription');
            localModel.pushNotificationEnabled = x.get('pushNotificationEnabled');
            localModel.emailEnabled = x.get('emailEnabled');
            return localModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async updateNotificationPreferences(res: Response, userId: number, viewModel: UpdateNotificationPreferencesViewModel)
        : Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.updateNotificationPreferences,
            {
                userId,
                pushSubscription: viewModel.pushSubscription ? PushSubscriptionViewModel.createArray(
                    viewModel.pushSubscription.endpoint,
                    viewModel.pushSubscription.keys.auth,
                    viewModel.pushSubscription.keys.p256dh) : null,
                pushNotificationEnabled: viewModel.notificationPreferences.pushNotificationEnabled,
                emailEnabled: viewModel.notificationPreferences.emailEnabled,
                pushNotificationTypes: NotificationsViewModel.createPushNotificationArray(
                    viewModel.notificationPreferences.pushCommentOnItemToOwner,
                    viewModel.notificationPreferences.pushHot
                ),
                emailNotificationTypes: NotificationsViewModel.createEmailNotificationArray(
                    viewModel.notificationPreferences.emailCommentOnItemToOwner,
                    viewModel.notificationPreferences.emailHot
                ),
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }
}

export const usersRepository = new UsersRepository();
