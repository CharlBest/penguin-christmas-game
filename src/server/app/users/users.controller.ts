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

        viewModel.username = viewModel.username.trim();
        viewModel.email = viewModel.email.trim();

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

        viewModel.emailOrUsername = viewModel.emailOrUsername.trim();

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
        const id = +req.params.id;
        const pageIndex = +req.query.pageIndex || 0;
        const pageSize = +req.query.pageSize || this.DEFAULT_PAGE_SIZE;

        res.status(200).json(
            await usersService.getUserPublic(res, req.ip, id, pageIndex, pageSize)
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

        viewModel.email = viewModel.email.trim();

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

        viewModel.email = viewModel.email.trim();

        const formGroup = BuildFormGroup.changeForgottenPassword(viewModel.password);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'email', Validators.required(viewModel.email));
        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'email', Validators.email(viewModel.email));
        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'code', Validators.required(viewModel.code));

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await usersService.changeForgottenPassword(res, viewModel.email, viewModel.code, viewModel.password)
        );
    }

    async verifyEmail(req: Request, res: Response, next: NextFunction) {
        const code = req.body.code;

        const hasErrors = ServerValidator.addGlobalError(res, 'code', Validators.required(code));

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
        const hasErrors = ServerValidator.addGlobalError(res, 'tutorialType', Validators.required(viewModel.tutorialType));

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await usersService.completedTutorial(res, viewModel)
        );
    }
}

export const usersController = new UsersController();
