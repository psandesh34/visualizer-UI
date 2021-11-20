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
  public holdings = [];
  @ViewChild('chart') chart: ChartComponent;

  pieChart() {}
  bubbleChart() {}

  loadedFeature = 'dashboard';
  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }

  constructor(public http: HttpClient, public dialog: MatDialog) {}

  ngOnInit() {
    this.http
      .get<any>('http://localhost:3000/portfolio/myUserId')
      .subscribe((data) => {
        this.holdings = data.holdings;
        this.holdings.forEach((element: any) => {
          element.investedAmount = +(
            element.totalQuantity * element.averagePrice
          ).toFixed(2);
          element.currentValue = +(
            element.totalQuantity * element.lastTradedPrice
          ).toFixed(2);
          element.profitLoss = +(
            element.currentValue - element.investedAmount
          ).toFixed(2);
          element.profitLossPercentage = +(
            ((element.currentValue - element.investedAmount) /
              element.investedAmount) *
            100
          ).toFixed(2);
        });
      });
  }

  openConfirmationDialog() {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"

    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        // do confirmation actions
      }
      // this.dialogRef = null;
    });
  }
}
