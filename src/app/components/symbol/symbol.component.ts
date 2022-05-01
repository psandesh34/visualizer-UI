import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
declare const TradingView: any;
export interface TradeInterface {
  exchange: string;
  price: number;
  quantity: number;
  tradeDate: Date;
  tradeType: string;
}
@Component({
  selector: 'app-symbol',
  templateUrl: './symbol.component.html',
  styleUrls: ['./symbol.component.css'],
})
export class SymbolComponent implements OnInit {
  symbolPair: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {}
  @ViewChild('containerDiv', { static: false }) containerDiv: ElementRef;
  public symbolName: string | null;
  data: any = {
    holding: {
      symbol: '',
      marketCapSection: '',
      sector: '',
      industry: '',
    },
  };
  trades: any = [];
  dataSource: MatTableDataSource<TradeInterface>;
  displayedColumns: string[] = [
    'quantity',
    'price',
    'tradeType',
    'exchange',
    'tradeDate',
  ];
  chartData = undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.symbolName = this.activatedRoute.snapshot.paramMap.get('symbolName');
    this.getSymbolDetails();
    this.getSymbolTrades();
    this.getHistoricalData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTableData() {
    this.dataSource = new MatTableDataSource(this.trades);
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

  getSymbolDetails() {
    this.http
      .get('http://localhost:3000/holdings/myUserId?symbol=' + this.symbolName)
      .subscribe((data: any) => {
        this.data = data;
      });
  }

  getSymbolTrades() {
    this.http
      .get('http://localhost:3000/trades/myUserId?symbol=' + this.symbolName)
      .subscribe((data: any) => {
        this.trades = data;
        this.loadTableData();
      });
  }

  getHistoricalData() {
    this.http
      .get(
        'http://localhost:3000/symbol/historical?symbol=' + this.symbolName
      )
      .subscribe((data: any) => {
        this.chartData = data;
        console.log(`SymbolComponent ~ this.http.get ~ data`, data);
      });
  }
}
