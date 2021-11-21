import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as helper from '../../shared/helper';
import { UploadTradebookDialogComponent } from '../portfolio/upload-tradebook-dialog/upload-tradebook-dialog.component';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/sharedDataService';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnChanges {
  holdings: any = [];
  requestExecuted = false;
  @ViewChild('dashboard') dashboard: DashboardComponent;

  constructor(
    public http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private sharedDataService: SharedDataService
  ) {
  }

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/portfolio/myUserId').subscribe(
      (data) => {
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
        this.sharedDataService.setValue(data);
        this.requestExecuted = true;
      },
      (error) => {
        helper.handleError(error);
      }
    );
  }

  ngOnChanges(): void {}
  // Create the method.
  importTradebook() {
    const dialogRef = this.dialog.open(UploadTradebookDialogComponent, {
      data: {},
    });
    this.router.navigate(['/portfolio']);
  }
}
