import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadTradebookDialogComponent } from '../portfolio/upload-tradebook-dialog/upload-tradebook-dialog.component';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/sharedDataService';
import { snackbarError } from '../../shared/helper';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalInvestedAmount = 0;
  holdings: any = [];

  requestExecuted = false;
  @ViewChild('dashboard') dashboard: DashboardComponent | undefined;

  constructor(
    public http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private sharedDataService: SharedDataService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.sharedDataService
      .getValue({ totalInvestedAmount: 1 })
      .subscribe((amount: any) => {
        this.totalInvestedAmount = amount;
      });
    // get totalInvestedAmount if not found in saved data
    if (!this.totalInvestedAmount) {
      this.http
        .get<any>('http://localhost:3000/holdings/overview/myUserId')
        .subscribe({
          next: (data) => {
            if (data) {
              this.totalInvestedAmount = parseFloat(
                data.totalInvestedAmount.toFixed(2)
              );
              // save totalInvestedAmount in shared data
              this.sharedDataService.setValue({
                totalInvestedAmount: this.totalInvestedAmount,
              });
              this.getPortfolio();
            }
            this.requestExecuted = true;
          },
          error: (error) => {
            snackbarError(this._snackBar, error.message);
          },
        });
    }
  }

  getPortfolio() {
    this.http.get<any>('http://localhost:3000/holdings/myUserId').subscribe({
      next: (data) => {
        this.holdings = data.holdings;
        this.holdings.forEach((element: any) => {
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
        this.requestExecuted = true;
        this.sharedDataService.setValue({
          holdings: this.holdings,
        });
        this.sharedDataService.setValue({
          chartData: data.chartData,
        });
      },
      error: (error) => {
        snackbarError(this._snackBar, error.message);
      },
    });
  }

  importTradebook() {
    const dialogRef = this.dialog.open(UploadTradebookDialogComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.ngOnInit();
      }, 3000);
    });
  }
}
