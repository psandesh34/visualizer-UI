import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { handleError } from 'src/app/shared/helper';

@Component({
  selector: 'app-upload-tradebook-dialog',
  templateUrl: './upload-tradebook-dialog.component.html',
  styleUrls: ['./upload-tradebook-dialog.component.css'],
})
export class UploadTradebookDialogComponent implements OnInit, OnDestroy {
  public myForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UploadTradebookDialogComponent>,
    private http: HttpClient
  ) {
    this.myForm = this.formBuilder.group({
      file: ['', Validators.required],
    });
  }
  ngOnInit(): void {}

  ngOnDestroy(): void {}
  public doAction() {
    this.dialogRef.close(this.myForm.getRawValue());
  }

  fileChange(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
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
        .subscribe(
          (data) => {
            console.log('success');
          },
          (error) => console.log(error)
        );
    }
  }
}
