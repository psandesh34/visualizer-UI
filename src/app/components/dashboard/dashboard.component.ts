import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadTradebookDialogComponent } from '../portfolio/upload-tradebook-dialog/upload-tradebook-dialog.component';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/sharedDataService';
import {
  snackbarError,
  snackbarInfo,
  closeSnackbar,
} from '../../shared/helper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  holdings: any = [];
  overview = {
    currentValue: 0,
    investedAmount: 0,
    profitLoss: 0,
    profitLossPercentage: 0,
  };
  totalInvestedAmount = this.overview.investedAmount;

  requestExecuted = false;
  @ViewChild('dashboard') dashboard: DashboardComponent | undefined;

  constructor(
    public http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private sharedDataService: SharedDataService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.sharedDataService
      .getValue({ overview: 1 })
      .subscribe((data: any) => {
        this.overview = data;
      });
    // get totalInvestedAmount if not found in saved data
    if (!this.overview.investedAmount) {
      snackbarInfo(this._snackBar, 'Getting your portfolio...');
      this.getPortfolio();
    } else {
      this.requestExecuted = true;
      this.totalInvestedAmount = this.overview.investedAmount;
    }
  }

  getPortfolio() {
    this.http.get<any>('http://localhost:3000/holdings/myUserId').subscribe({
      next: (data) => {
        closeSnackbar(this._snackBar);
        this.holdings = data.holdings;
        this.overview = data.overview;
        this.totalInvestedAmount = this.overview.investedAmount;
        this.requestExecuted = true;
        this.sharedDataService.setValue({
          holdings: data.holdings,   });
        this.sharedDataService.setValue({
          chartData: data.chartData,   });
        this.sharedDataService.setValue({
          overview: data.overview,   });
      }, error: (error) => {
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
