import { NextFunction, Request, Response } from 'express';
import { v4 as nodeUUId } from 'uuid';
import { BuildFormGroup, ServerValidator, Validators } from '../../../shared/validation/validators';
import { CreateUserViewModel } from '../../../shared/view-models/create-user/create-user.view-model';
import { LoginViewModel } from '../../../shared/view-models/create-user/login.view-model';
import { ChangeForgottenPasswordViewModel } from '../../../shared/view-models/forgot-password/change-forgotten-password.view-model';
import { ForgotPasswordViewModel } from '../../../shared/view-models/forgot-password/forgot-password.view-model';
import { UpdateAvatarViewModel } from '../../../shared/view-models/profile/update-avatar.view-model';
import { UpdateBioViewModel } from '../../../shared/view-models/profile/update-bio.view-model';
import { UpdatePasswordViewModel } from '../../../shared/view-models/profile/update-password.view-model';
import { CompletedTutorial } from '../../../shared/view-models/tutorial/completed-tutorial.view-model';
import { BaseController } from '../shared/base-controller';
import { usersService } from './users.service';

class UsersController extends BaseController {

    constructor() {
        super();
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as CreateUserViewModel;

        if (viewModel.username) {
            viewModel.username = viewModel.username.trim();
        }
        if (viewModel.email) {
            viewModel.email = viewModel.email.trim();
        }

        const formGroup = BuildFormGroup.createUser(viewModel.email, viewModel.username, viewModel.password);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw new Error();
        }

        res.status(201).json(
            await usersService.createUser(res, viewModel.email, viewModel.username, viewModel.password)
        );
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as LoginViewModel;

        if (viewModel.emailOrUsername) {
            viewModel.emailOrUsername = viewModel.emailOrUsername.trim();
        }

        const formGroup = BuildFormGroup.login(viewModel.emailOrUsername, viewModel.password);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await usersService.login(res, viewModel.emailOrUsername, viewModel.password)
        );
    }

    async getUserProfile(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(
            await usersService.getUserProfile(res)
        );
    }

    async getUserPublic(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id ? +req.params.id : null;
        const pageIndex = req.query.pageIndex ? +req.query.pageIndex : null || 0;
        const pageSize = req.query.pageSize ? +req.query.pageSize : null || this.DEFAULT_PAGE_SIZE;

        const hasErrors = !!Validators.required(id);

        if (hasErrors) {
            throw new Error('Id is required');
        }

        res.status(200).json(
            await usersService.getUserPublic(res, req.ip, id!, pageIndex, pageSize)
        );
    }

    async report(req: Request, res: Response, next: NextFunction) {
        // TODO: do something
        res.status(200).json();
    }

    // TODO: not in use
    async doesUsernameAndEmailExist(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as CreateUserViewModel;

        res.status(200).json(
            await usersService.doesUsernameAndEmailExist(res, viewModel.email, viewModel.username)
        );
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as ForgotPasswordViewModel;

        if (viewModel.email) {
            viewModel.email = viewModel.email.trim();
        }

        const formGroup = BuildFormGroup.forgotPassword(viewModel.email);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await usersService.forgotPassword(res, viewModel.email, nodeUUId())
        );
    }

    async changeForgottenPassword(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as ChangeForgottenPasswordViewModel;

        if (viewModel.email) {
            viewModel.email = viewModel.email.trim();
        }

        const formGroup = BuildFormGroup.changeForgottenPassword(viewModel.password);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'changeForgottenPasswordEmail', Validators.required(viewModel.email));
        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'changeForgottenPasswordEmail', Validators.email(viewModel.email));
        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'changeForgottenPasswordCode', Validators.required(viewModel.code));

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await usersService.changeForgottenPassword(res, viewModel.email, viewModel.code, viewModel.password)
        );
    }

    async verifyEmail(req: Request, res: Response, next: NextFunction) {
        const code = req.body.code as string;

        const hasErrors = ServerValidator.addGlobalError(res, 'verifyEmailCode', Validators.required(code));

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await usersService.verifyEmail(res, code)
        );
    }

    async updateAvatar(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UpdateAvatarViewModel;

        res.status(200).json(
            await usersService.updateAvatar(res, viewModel.avatarUrl)
        );
    }

    async updateBio(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UpdateBioViewModel;

        res.status(200).json(
            await usersService.updateBio(res, viewModel.content)
        );
    }

    async updatePassword(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UpdatePasswordViewModel;

        const formGroup = BuildFormGroup.updatePassword(viewModel.password, viewModel.newPassword, viewModel.newPassword);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await usersService.updatePassword(res, viewModel.password, viewModel.newPassword)
        );
    }

    async resendEmailVerificationLink(req: Request, res: Response, next: NextFunction) {
        await usersService.resendEmailVerificationLink(res);

        res.status(200).json();
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(
            await usersService.deleteUser(res)
        );
    }

    async completedTutorial(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as CompletedTutorial;

        // TODO: no UI element for this error
        const hasErrors = !!Validators.required(viewModel.tutorialType);

        if (hasErrors) {
            throw new Error('Tutorial type is required');
        }

        res.status(200).json(
            await usersService.completedTutorial(res, viewModel)
        );
    }
}

export const usersController = new UsersController();
