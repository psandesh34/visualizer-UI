import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChartComponent } from 'ng-apexcharts';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  active = 1;
  title = 'visualizer';
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  pieChart() {}
  bubbleChart() {}

  loadedFeature = 'dashboard';
  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }

  constructor(public http: HttpClient, public dialog: MatDialog) {}

  ngOnInit() {
  }
}
