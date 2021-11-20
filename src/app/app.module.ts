import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from "ng-apexcharts";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { headerComponent } from './components/header/header.component';
import { Dropdowndirective } from "./shared/dropdown.directive";
import { ChartsComponent } from './components/charts/charts.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UploadComponent } from './upload/upload.component';
import { MatSortModule } from '@angular/material/sort';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { MaterialModule } from './shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { UploadTradebookDialogComponent } from "./components/portfolio/upload-tradebook-dialog/upload-tradebook-dialog.component";
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [AppComponent,
    headerComponent,
    Dropdowndirective,
    ChartsComponent,
    DashboardComponent,
    UploadComponent,
    PortfolioComponent,
    UploadTradebookDialogComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    BrowserAnimationsModule,
    MatSortModule,
    MaterialModule,
    HttpClientModule
  ],
  exports: [AppComponent,
    headerComponent,
    Dropdowndirective,
    ChartsComponent,
    DashboardComponent,
    UploadComponent,
    PortfolioComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
