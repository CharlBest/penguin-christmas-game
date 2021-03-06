import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Injectable()
export class DialogService {
    constructor(private dialog: MatDialog) { }

    alert(message: string) {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
            disableClose: true
        });
        dialogRef.componentInstance.message = message;
    }

    confirm(message: string, confirmButtonText: string | null = null, closeButtonText: string | null = null): Observable<boolean> {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            disableClose: true
        });
        dialogRef.componentInstance.message = message;
        if (confirmButtonText) {
            dialogRef.componentInstance.confirmButtonText = confirmButtonText;
        }
        if (closeButtonText) {
            dialogRef.componentInstance.closeButtonText = closeButtonText;
        }

        return dialogRef.afterClosed();
    }
}
