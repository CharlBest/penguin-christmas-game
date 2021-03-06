import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../shared/services/auth.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { ProfileService } from '../profile.service';

@Component({
    selector: 'app-delete-user',
    templateUrl: './delete-user.component.html',
    styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

    email: string | null;
    isProcessing = false;

    constructor(private snackBar: MatSnackBar,
        private profileService: ProfileService,
        private route: ActivatedRoute,
        private authService: AuthService,
        public bpService: BreakpointService) { }

    ngOnInit() {
        this.getParams();
    }

    getParams() {
        this.route.queryParamMap.subscribe(params => {
            if (params.has('email')) {
                this.email = params.get('email');
            }
        });
    }

    delete(email: string) {
        if (this.email && email === this.email) {
            this.isProcessing = true;

            this.snackBar.open('Deleting...');

            this.profileService.deleteUser()
                .pipe(finalize(() => this.isProcessing = false))
                .subscribe(() => {
                    this.authService.removeTokenAndNavigateToLogin();
                    this.snackBar.dismiss();

                    this.snackBar.open('Deleted');
                }, error => {
                    this.snackBar.dismiss();
                    this.snackBar.open('Deleting failed');
                });
        }
    }
}
