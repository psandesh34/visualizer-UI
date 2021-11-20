import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTradebookDialogComponent } from './upload-tradebook-dialog.component';

describe('UploadTradebookDialogComponent', () => {
  let component: UploadTradebookDialogComponent;
  let fixture: ComponentFixture<UploadTradebookDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadTradebookDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadTradebookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
