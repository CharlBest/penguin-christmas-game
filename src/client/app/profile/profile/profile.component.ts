import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { ReportUserViewModel } from '../../../../shared/view-models/profile/report-user.view-model';
import { UpdateAvatarViewModel } from '../../../../shared/view-models/profile/update-avatar.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { UserProfileViewModel } from '../../../../shared/view-models/user/user-profile.view-model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FirebaseStorageService } from '../../shared/firebase-storage.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';
import { TutorialService } from '../../shared/tutorial/tutorial.service';
import { DeleteUserDialogComponent } from '../delete-user-dialog/delete-user-dialog.component';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: UserProfileViewModel = null;
  isProcessing = true;
  tutorialTypeEnum = TutorialType;

  constructor(private profileService: ProfileService,
    private shareDialogService: ShareDialogService,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private tutorialService: TutorialService,
    private firebaseStorageService: FirebaseStorageService,
    private formErrorsService: FormErrorsService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.profileService.getUserProfile()
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.user = data;

        // Default card first
        if (this.user.userCards) {
          this.user.userCards.sort((a, b) => <any>b.isDefault - <any>a.isDefault);
        }
      }, error => {
        this.formErrorsService.updateFormValidity(error);
      });
  }

  openShareDialog() {
    const link = ['/user', this.user.id];
    this.shareDialogService.share(link);
  }

  reportUser() {
    this.dialogService.confirm('This user is either spam, abusive, harmful or you think it doesn\'t belong on here.').subscribe(data => {
      if (data) {
        const viewModel = new ReportUserViewModel;
        viewModel.uId = this.user.uId;

        this.snackBar.open('Sending...', null, {
          duration: 10000,
        });

        this.profileService.sendReport(viewModel)
          .subscribe(() => {
            this.snackBar.dismiss();
            this.snackBar.open('Sent', null, {
              duration: 2000,
            });
          }, error => {
            this.snackBar.dismiss();
            this.snackBar.open('Sending failed', null, {
              duration: 2000,
            });
          });
      }
    })
  }

  updateAvatar(downloadURL: string) {
    const viewModel = new UpdateAvatarViewModel;
    viewModel.avatarUrl = downloadURL;

    this.profileService.updateAvatar(viewModel)
      .subscribe(() => {
        this.user.avatarUrl = viewModel.avatarUrl;
      }, error => {
        this.formErrorsService.updateFormValidity(error);
      });
  }

  removeAvatar() {
    this.firebaseStorageService.delete(this.user.avatarUrl).subscribe(data => {
      if (data) {
        this.updateAvatar(null);
      }
    });
  }

  resendEmailVerificationLink() {
    this.snackBar.dismiss();
    this.snackBar.open('Sending...', null, {
      duration: 10000,
    });

    this.profileService.resendEmailVerificationLink()
      .subscribe(() => {
        this.snackBar.dismiss();
        this.snackBar.open('Sent', null, {
          duration: 2000,
        });
      }, error => {
        this.snackBar.dismiss();
        const sendingBar = this.snackBar.open('Sending failed', 'Resend', {
          duration: 5000,
        });
        sendingBar.onAction().subscribe(x => {
          this.resendEmailVerificationLink();
        });
      });
  }

  openDeleteAccountDialog() {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent);
    dialogRef.componentInstance.email = this.user.email;
  }

  profileTour() {
    this.tutorialService.activateTutorial(TutorialType.ProfileShare);
  }
}
