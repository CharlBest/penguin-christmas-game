import { Component, Input, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { UpdateBioViewModel } from '../../../../shared/view-models/profile/update-bio.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { HTMLEditorComponent } from '../../shared/html-editor/html-editor/html-editor.component';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-update-bio',
  templateUrl: './update-bio.component.html',
  styleUrls: ['./update-bio.component.scss']
})
export class UpdateBioComponent {

  @ViewChild('htmlEditor') htmlEditor: HTMLEditorComponent;
  isProcessing = false;
  @Input() content = '';

  constructor(public formErrorsService: FormErrorsService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar) { }

  emojiInserted(shortname: string) {
    this.htmlEditor.insertText(shortname, true);
  }

  onSubmit() {
    const viewModel = new UpdateBioViewModel();
    viewModel.content = this.htmlEditor.getInnerHTML();

    if (this.content !== viewModel.content) {
      this.isProcessing = true;

      this.snackBar.open('Updating bio...');

      this.profileService.updateBio(viewModel)
        .pipe(finalize(() => this.isProcessing = false))
        .subscribe(() => {
          this.htmlEditor.updateFileStorageWithUrls();
          this.content = viewModel.content;

          this.snackBar.dismiss();
          this.snackBar.open('Updated bio');
        }, error => {
          this.snackBar.dismiss();
          this.snackBar.open('Update failed');

          this.formErrorsService.updateFormValidity(error);
          this.snackBar.dismiss();
        });
    }
  }
}
