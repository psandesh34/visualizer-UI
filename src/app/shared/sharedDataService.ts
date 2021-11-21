import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core'; // at top

@Injectable({
  providedIn: 'root', // just before your class
})
export class SharedDataService {
  constructor() {}
  //Using any
  // public portfolioInfo: any = {};
  // public subject = new Subject<any>();
  // private messageSource = new BehaviorSubject(this.portfolioInfo);
  // currentMessage = this.messageSource.asObservable();
  // changeMessage(data: any) {
  //   this.messageSource.next(data);
  // }
  // public getPortfolioInfo(): Observable<any> {
  //   return this.portfolioInfo.asObservable();
  // }
  /*
   * @param {string} message : siblingMsg
   */
  // public updatePortfolioInfo(data: any): void {
  //   this.portfolioInfo.next(data);
  // }
  private portfolioInfo: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public setValue(value: any): void {
    this.portfolioInfo.next(value);
  }

  public getValue(): Observable<any> {
    return this.portfolioInfo;
  }
}
