import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core'; // at top

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private holdings: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private totalInvestedAmount: BehaviorSubject<any> =
    new BehaviorSubject<number>(0);
  private chartData: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  private overview: BehaviorSubject<any> = new BehaviorSubject<any>({});

  public setValue(valueObject: any): void {
    if (valueObject.hasOwnProperty('totalInvestedAmount')) {
      this.totalInvestedAmount.next(valueObject.totalInvestedAmount);
    } else if (valueObject.hasOwnProperty('holdings')) {
      this.holdings.next(valueObject.holdings);
    } else if (valueObject.hasOwnProperty('chartData')) {
      this.chartData.next(valueObject.chartData);
    } else if (valueObject.hasOwnProperty('overview')) {
      this.overview.next(valueObject.overview);
    }
  }

  public getValue(valueObject: any): Observable<any> | any {
    if (valueObject.totalInvestedAmount) {
      return this.totalInvestedAmount;
    } else if (valueObject.holdings) {
      return this.holdings.asObservable();
    } else if (valueObject.chartData) {
      return this.chartData.asObservable();
    } else if (valueObject.overview) {
      return this.overview.asObservable();
    }
  }
}
