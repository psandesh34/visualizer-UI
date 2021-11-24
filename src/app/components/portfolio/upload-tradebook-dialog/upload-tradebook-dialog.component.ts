import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { handleError } from 'src/app/shared/helper';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-upload-tradebook-dialog',
  templateUrl: './upload-tradebook-dialog.component.html',
  styleUrls: ['./upload-tradebook-dialog.component.css'],
})
export class UploadTradebookDialogComponent implements OnInit, OnDestroy {
  public myForm: FormGroup;
  fileList: FileList;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UploadTradebookDialogComponent>,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.myForm = this.formBuilder.group({
      file: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {}

  ngOnDestroy(): void {}
  public uploadTradebook() {
    //Add a snackbar here saying started importing
    if (this.fileList.length > 0) {
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('userId', 'myUserId');
      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'multipart/form-data');
      myHeaders.append('Accept', 'application/json');
      const httpOptions = {
        headers: new HttpHeaders({
          Accept: 'application/json',
        }),
      };
      this.http
        .post(`http://localhost:3000/tradebook/upload`, formData, httpOptions)
        .pipe(catchError(handleError))
        .subscribe({
          next: (data) => {
            console.log('success');
          },
          error: (error) => console.log(error),
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
