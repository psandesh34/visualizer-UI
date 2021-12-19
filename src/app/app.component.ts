import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  active = 1;
  title = 'Visualizer';
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  loadedFeature = 'dashboard';
  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
  status: boolean = true;
  clickEvent() {
    this.status = !this.status;
  }
  constructor(public http: HttpClient, public dialog: MatDialog) {}
}
