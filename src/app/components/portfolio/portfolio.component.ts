import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { UploadTradebookDialogComponent } from './upload-tradebook-dialog/upload-tradebook-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { snackbarError, snackbarSuccess } from '../../shared/helper';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/sharedDataService';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements AfterViewInit, OnInit {
  confirmationDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  holdings: any = [];
  displayedColumns: string[] = [
    'symbol',
    'totalQuantity',
    'averagePrice',
    'lastTradedPrice',
    'investedAmount',
    'currentValue',
    'profitLoss',
    'profitLossPercentage',
  ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    private sharedDataService: SharedDataService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.sharedDataService
      .getValue({ holdings: 1 })
      .subscribe((holdings: any) => {
        this.holdings = holdings;
        this.loadTableData();
      });
    if (this.holdings.length === 0) {
      this.getPortfolio();
    }
    this.dataSource = new MatTableDataSource(this.holdings);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTableData() {
    this.dataSource = new MatTableDataSource(this.holdings);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Create the method.
  importTradebook() {
    this.dialog.open(UploadTradebookDialogComponent, {
      data: {},
    });
  }

  deletePortfolio() {
    this.confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
    });
    this.confirmationDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmationDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http.delete('http://localhost:3000/portfolio/myUserId').subscribe({
          next: () => {
            this.sharedDataService.setValue({ holdings: [] });
            this.sharedDataService.setValue({ totalInvestedAmount: 0 });
            snackbarSuccess(this._snackBar, 'Portfolio deleted.');
            this.router.navigate(['/dashboard']);
          },
          error: (error: Error) => {
            snackbarError(this._snackBar, error.message);
          },
        });
      }
    });
  }

  getPortfolio() {
    this.http.get<any>('http://localhost:3000/holdings/myUserId').subscribe({
      next: (data) => {
        this.holdings = data;
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
        this.sharedDataService.setValue({ holdings: this.holdings });
        this.loadTableData();
      },
      error: (error) => {
        snackbarError(this._snackBar, error.message);
      },
    });
  }
}
