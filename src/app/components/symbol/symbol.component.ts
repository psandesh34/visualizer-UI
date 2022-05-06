import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';

// import {
//   ChartComponent,
//   ApexAxisChartSeries,
//   ApexChart,
//   ApexFill,
//   ApexXAxis,
//   ApexDataLabels,
//   ApexYAxis,
//   ApexTitleSubtitle,
// } from 'ng-apexcharts';

// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   xaxis: ApexXAxis;
//   yaxis: ApexYAxis;
//   title: ApexTitleSubtitle;
//   fill: ApexFill;
//   dataLabels: ApexDataLabels;
// };

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
  // @ViewChild('chart') chart: ChartComponent;
  // public chartOptions: Partial<ChartOptions>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {
    //Apex charts data:
    // this.chartOptions = {
    //   series: [
    //     {
    //       name: 'Bubble1',
    //       data: [
    //         Math.floor(Math.random() * (750 - 1 + 1)) + 1,
    //         Math.floor(Math.random() * (750 - 1 + 1)) + 1,
    //         Math.floor(Math.random() * (750 - 1 + 1)) + 1,
    //       ],
    //     },
    //     {
    //       name: 'Bubble2',
    //       data: [
    //         Math.floor(Math.random() * (750 - 1 + 1)) + 1,
    //         Math.floor(Math.random() * (750 - 1 + 1)) + 1,
    //         Math.floor(Math.random() * (750 - 1 + 1)) + 1,
    //       ],
    //     },
    //     {
    //       name: 'Bubble3',
    //       data: [
    //         Math.floor(Math.random() * (750 - 1 + 1)) + 1,
    //         Math.floor(Math.random() * (750 - 1 + 1)) + 1,
    //         Math.floor(Math.random() * (750 - 1 + 1)) + 1,
    //       ],
    //     },
    //     {
    //       name: 'Bubble4',
    //       data: [
    //         Math.floor(Math.random() * (750 - 1 + 1)) + 1,
    //         Math.floor(Math.random() * (750 - 1 + 1)) + 1,
    //         Math.floor(Math.random() * (750 - 1 + 1)) + 1,
    //       ],
    //     },
    //   ],
    //   chart: {
    //     height: 350,
    //     type: 'bubble',
    //   },
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   fill: {
    //     opacity: 0.8,
    //   },
    //   title: {
    //     text: 'Simple Bubble Chart',
    //   },
    //   xaxis: {
    //     tickAmount: 12,
    //     type: 'category',
    //   },
    //   yaxis: {
    //     max: 70,
    //   },
    // };
  }
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
  chartData = { labels: [], data: [] };

  lastYearChart = {
    labels: [],
    datasets: [
      {
        label: 'ahahahaha this is the chart Name, Random data go........',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.25,
      },
    ],
  };

  tradesBubbleChart = { datasets: [] };
  // [
  // {
  //   label: '',
  //   data: [],
  //   backgroundColor: '',
  // },
  // ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.symbolName = this.activatedRoute.snapshot.paramMap.get('symbolName');
    // this.getSymbolTrades();
    this.getSymbolHistory();
    this.getTradeHistory();
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
        this.loadTableData();
      });
  }

  display1yLineChart() {
    new Chart('lastYearChart', {
      type: 'line',
      data: this.lastYearChart,
    });
    new Chart('tradesBubbleChart', {
      type: 'bubble',
      data: this.tradesBubbleChart,
    });
  }

  displayTradesScatterPlot() {
    // Check if we have bith the trades array and the historical data
    if (this.chartData && this.data) {
    }
  }

  getSymbolHistory() {
    this.http
      .get(
        'http://localhost:3000/symbol/history/myUserId?symbol=' +
          this.symbolName
      )
      .subscribe((symbolHistory: any) => {
        this.chartData = symbolHistory.previousYearPrices;
        if (this.chartData) {
          this.lastYearChart.labels = this.chartData.labels;
          this.lastYearChart.datasets[0].data = this.chartData.data;
          this.display1yLineChart();
        }
        // Info to be used for symbol sectors, industry etc
        this.data = {
          holding: symbolHistory.holding,
          data: symbolHistory.trades,
        };
      });
  }

  getTradeHistory() {
    this.http
      .get(
        'http://localhost:3000/trades/history/myUserId?symbol=' +
          this.symbolName
      )
      .subscribe((data: any) => {
        console.log(`SymbolComponent ~ .subscribe ~ data`, data);
        this.trades = data.trades;
        data.dataArray.forEach((element: any) => {
          element.data.forEach((element2: any) => {
            element2.x = new Date(element2.x).toLocaleDateString();
          });
        });

        console.log(
          `SymbolComponent ~ .subscribe ~ data.dataArray`,
          data.dataArray
        );
        this.tradesBubbleChart = { datasets: data.dataArray };
        this.loadTableData();
      });
  }

  public generateData(
    baseval: number,
    count: number,
    yrange: { min: number; max: number }
  ) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }
}
