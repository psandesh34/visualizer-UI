import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { randomRGB } from 'src/app/shared/helper';
import { SharedDataService } from 'src/app/shared/sharedDataService';
Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnChanges, OnInit {
  @Input() chartData: any = this.sharedDataService.getValue({ chartData: 1 });
  chartDisplayed = false;

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit() {}

  ngOnChanges() {
    //avoids displaying chart if there are no holdings
    if (this.chartDisplayed === false && this.chartData !== undefined) {
      this.displayChart();
      this.chartDisplayed = true;
    }
  }

  displayChart() {
    let marketCapSymbolLabels: string[] = [];
    let marketCapSymbolData: number[] = [];
    let marketCapSectionLabels: string[] = [];
    let marketCapSectionData: number[] = [];
    let industrySymbolLabels: string[] = [];
    let industryData: number[] = [];
    let industrySectionLabels: string[] = [];
    let industrySectionData: number[] = [];
    for (const property in this.chartData) {
      for (const sectionName in this.chartData[property]) {
        if (property === 'marketCapSection') {
          // array of symbols in each marketCap category
          marketCapSymbolLabels = marketCapSymbolLabels.concat(
            this.chartData[property][sectionName].labels
          );
          // array of invested amount for each symbol. Each investedAmount is for the marketCapSymbolLabel with same index.
          marketCapSymbolData = marketCapSymbolData.concat(
            this.chartData[property][sectionName].data
          );
          // array of marketCap categories
          marketCapSectionLabels.push(sectionName);
          // array of investedAmounts for each marketCap category
          marketCapSectionData.push(
            this.chartData[property][sectionName].totalInvestedAmount
          );
        } else if (property === 'industry') {
          // array of symbols in each industry category
          industrySymbolLabels = industrySymbolLabels.concat(
            this.chartData[property][sectionName].labels
          );
          // array of invested amount for each symbol. Each investedAmount is for the industrySymbolLabel with same index.
          industryData = industryData.concat(
            this.chartData[property][sectionName].data
          );
          // array of industry categories
          industrySectionLabels.push(sectionName);
          // array of investedAmounts for each industry category
          industrySectionData.push(
            this.chartData[property][sectionName].totalInvestedAmount
          );
        }
      }
    }
    const data1 = {
      datasets: [
        {
          // generate random background colors
          backgroundColor: Array.from(
            { length: marketCapSymbolData.length },
            () => randomRGB()
          ),
          // Zeroes are appended for compatibility with chartJS, need to look for a better way
          data: this.getArray(0, marketCapSectionData.length).concat(
            marketCapSymbolData
          ),
        },
        {
          backgroundColor: this.getArray(
            '#666666',
            marketCapSectionData.length
          ),
          data: marketCapSectionData,
        },
      ],
      labels: marketCapSectionLabels.concat(marketCapSymbolLabels),
    };
    const data2 = {
      datasets: [
        {
          backgroundColor: Array.from({ length: industryData.length }, () =>
            randomRGB()
          ),
          data: this.getArray(0, industrySectionData.length).concat(
            industryData
          ),
        },
        {
          backgroundColor: Array.from(
            { length: industrySectionData.length },
            () => randomRGB()
          ),
          data: industrySectionData,
        },
      ],
      labels: industrySectionLabels.concat(industrySymbolLabels),
    };
    //create Chart class object
    new Chart('marketCapChart', {
      type: 'doughnut',
      data: data1,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
    new Chart('industryChart', {
      type: 'doughnut',
      data: data2,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  //get array of n given elements
  getArray<T>(element: T, n: number) {
    const zeroes = new Array(n).fill(element);
    return zeroes;
  }
}
