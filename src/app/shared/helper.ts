import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

export function snackbarError(snackbar: MatSnackBar, message: string) {
  snackbar.openFromComponent(SnackbarComponent, {
    duration: 5 * 1000,
    verticalPosition: 'top',
    horizontalPosition: 'right',
    data: {
      message: message,
      action: 'error',
    },
    panelClass: 'snackbarError',
  });
}

export function snackbarSuccess(snackbar: MatSnackBar, message: string) {
  snackbar.openFromComponent(SnackbarComponent, {
    duration: 5 * 1000,
    verticalPosition: 'top',
    horizontalPosition: 'right',
    data: {
      message: message,
      action: 'success',
    },
    panelClass: 'snackbarSuccess',
  });
}

export function snackbarInfo(snackbar: MatSnackBar, message: string) {
  snackbar.openFromComponent(SnackbarComponent, {
    duration: 5 * 1000,
    verticalPosition: 'top',
    horizontalPosition: 'right',
    data: {
      message: message,
      action: 'info',
    },
    panelClass: 'snackbarInfo',
  });
}
