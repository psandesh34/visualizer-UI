import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  closeSnackbar,
  snackbarError,
  snackbarInfo,
  snackbarSuccess,
} from 'src/app/shared/helper';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-tradebook-dialog',
  templateUrl: './upload-tradebook-dialog.component.html',
  styleUrls: ['./upload-tradebook-dialog.component.css'],
})
export class UploadTradebookDialogComponent {
  public myForm: FormGroup;
  fileList: FileList;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UploadTradebookDialogComponent>,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = this.formBuilder.group({
      file: new FormControl('', [Validators.required]),
    });
  }

  public uploadTradebook() {
    //Add a snackbar here saying started importing
    if (this.fileList.length > 0) {
      const file: File = this.fileList[0];
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('userId', 'myUserId');
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'multipart/form-data');
      myHeaders.append('Accept', 'application/json');
      const httpOptions = {
        headers: new HttpHeaders({
          Accept: 'application/json',
        }),
      };
      snackbarInfo(this._snackBar, 'Importing Tradebook!');
      this.http
        .post(`http://localhost:3000/tradebook/upload`, formData, httpOptions)
        .subscribe({
          next: () => {
            setTimeout(() => {
              closeSnackbar(this._snackBar);
              snackbarInfo(this._snackBar, 'Please try refreshing the page!');
            },
            2000);
          },
          error: (error) => snackbarError(this._snackBar, error.message),
        });
    }
    this.dialogRef.close(this.myForm.getRawValue());
    this.router
      .navigateByUrl('/dashboard', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['dashboard']);
      });
  }

  fileChange(event: any) {
    this.fileList = event.target.files;
  }
}
