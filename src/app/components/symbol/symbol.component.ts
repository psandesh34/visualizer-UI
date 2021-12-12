import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare const TradingView: any;

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
  ngOnInit(): void {
    this.symbolName = this.activatedRoute.snapshot.paramMap.get('symbolName');
    this.getSymbolDetails();
  }

  getSymbolDetails() {
    this.http
      .get('http://localhost:3000/holdings/myUserId?symbol=' + this.symbolName)
      .subscribe((data: any) => {
        this.data = data;
      });
  }
}
