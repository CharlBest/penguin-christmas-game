import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatIconModule, MatInputModule, MatListModule, MatProgressSpinnerModule, MatRadioModule, MatSlideToggleModule, MatSnackBarModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { ContextMenuModule } from '../shared/context-menu/context-menu.module';
import { EmojiPanelModule } from '../shared/emoji-panel/emoji-panel.module';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { HTMLEditorModule } from '../shared/html-editor/html-editor.module';
import { MediaModule } from '../shared/media/media.module';
import { ShareDialogModule } from '../shared/share-dialog/share-dialog.module';
import { StripeElementsModule } from '../shared/stripe-elements/stripe-elements.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { UploadButtonModule } from '../shared/upload-button/upload-button.module';
import { CreateCardComponent } from './create-card/create-card.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { LanguageComponent } from './language/language.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentsComponent } from './payments/payments.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { UpdateBioComponent } from './update-bio/update-bio.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatInputModule,
  MatListModule,
  MatChipsModule,
  MatRadioModule,
  MatTableModule,
  MatSlideToggleModule,
  MatCheckboxModule,
];

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ShareDialogModule,
    UploadButtonModule,
    FormErrorsModule,
    TutorialModule,
    EmojiPanelModule,
    MediaModule,
    HTMLEditorModule,
    StripeElementsModule,
    ContextMenuModule,
    ...materialModules
  ],
  declarations: [
    ProfileComponent,
    UpdateBioComponent,
    UpdatePasswordComponent,
    DeleteUserComponent,
    PaymentsComponent,
    PaymentHistoryComponent,
    CreateCardComponent,
    NotificationsComponent,
    LanguageComponent,
  ]
})
export class ProfileModule { }
