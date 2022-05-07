import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexAnnotations,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  annotations: ApexAnnotations;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  labels: string[];
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

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

  //Apex charts
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  public tradeAnnotationData: any = [];
  public symbolHistory: any;

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.symbolName = this.activatedRoute.snapshot.paramMap.get('symbolName');
    this.getSymbolTrades();
    this.getSymbolHistory();
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

  getSymbolTrades() {
    this.http
      .get('http://localhost:3000/trades/myUserId?symbol=' + this.symbolName)
      .subscribe((data: any) => {
        this.trades = data;
        this.createApexChart();
        this.loadTableData();
      });
  }

  getSymbolHistory() {
    this.http
      .get(
        'http://localhost:3000/symbol/history/myUserId?symbol=' +
          this.symbolName
      )
      .subscribe((symbolHistory: any) => {
        this.symbolHistory = symbolHistory;
        this.createApexChart();
        // Info to be used for symbol sectors, industry etc
        this.data = {
          holding: symbolHistory.holding,
          data: symbolHistory.trades,
        };
      });
  }

  createApexChart() {
    if (!(this.symbolHistory && this.trades)) {
      return;
    }
    const annotationPoints: ApexAnnotations = {
      points: [],
    };
    this.trades.forEach((trade: TradeInterface) => {
      annotationPoints.points?.push({
        x: new Date(trade.tradeDate).getTime(),
        y: trade.price,
        marker: {
          size: 2,
          fillColor: trade.tradeType === 'sell' ? '#EE4B2B' : '#39FF14',
          strokeColor: trade.tradeType === 'sell' ? '#EE4B2B' : '#39FF14',
          radius: 0,
          cssClass: 'apexcharts-custom-class',
        },
        label: {
          borderColor: trade.tradeType === 'sell' ? '#FF4560' : '#39FF14',
          offsetY: 0,
          style: {
            color: trade.tradeType === 'sell' ? '#fff' : '#000',
            background: trade.tradeType === 'sell' ? '#FF4560' : '#39FF14',
            cssClass: 'apexcharts-point-annotation-label',
          },

          text: `${trade.tradeType}: ${trade.quantity}@${trade.price}`,
        },
      });
    });

    const prices = this.symbolHistory.previousYearPrices.data;
    const labels = this.symbolHistory.previousYearPrices.labels;
    this.chartOptions = {
      series: [
        {
          name: 'series',
          data: prices,
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: true,
          type: 'xy',
          // autoScaleYaxis: true,
        },
      },
      annotations: annotationPoints,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
        width: 2,
      },
      grid: {
        padding: {
          right: 30,
          left: 20,
        },
      },
      title: {
        text: 'Line with Annotations',
        align: 'left',
      },
      labels: labels,
      xaxis: {
        type: 'datetime',
      },
    };
  }
}
