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

export function closeSnackbar(snackbar: MatSnackBar) {
  snackbar.dismiss();
}

export function randomRGB() {
  const letters = 'abcdef1234567890'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}
