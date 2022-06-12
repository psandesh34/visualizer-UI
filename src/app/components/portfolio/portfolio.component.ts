import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { UploadTradebookDialogComponent } from './upload-tradebook-dialog/upload-tradebook-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import {
  closeSnackbar,
  snackbarError,
  snackbarInfo,
  snackbarSuccess,
} from '../../shared/helper';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/sharedDataService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Chart, registerables } from 'chart.js';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

Chart.register(...registerables);
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
  chartData = undefined;

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
    if (this.chartData === undefined) {
      this.sharedDataService
        .getValue({ chartData: 1 })
        .subscribe((chartData: any) => {
          this.sharedDataService.getValue({ chartData: 1 });
          this.chartData = chartData;
        });
    }
    if (this.holdings.length === 0) {
      this.getPortfolio();
    }
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

  getPortfolio(date: Date = new Date()) {
    const stringDate = date.toString();
    snackbarInfo(this._snackBar, 'Getting your portfolio...');
    this.http
      .get<any>(
        'http://localhost:3000/holdings/myUserId?holdingDate=' + stringDate
      )
      .subscribe({
        next: (data) => {
          closeSnackbar(this._snackBar);
          this.holdings = data.holdings;
          this.chartData = data.chartData;
          this.loadTableData();
          this.sharedDataService.setValue({ holdings: this.holdings });
          this.sharedDataService.setValue({ chartData: data.chartData });
          this.sharedDataService.setValue({
            overview: data.overview,
          });
        },
        error: (error: any) => {
          snackbarError(this._snackBar, error.error.message);
        },
      });
  }

  portfolioDate = new FormControl(new Date());
  @Output()
  dateChange: EventEmitter<MatDatepickerInputEvent<any>> = new EventEmitter();
  onDateChange(): void {
    this.getPortfolio(this.portfolioDate.value);
  }
}
