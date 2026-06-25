import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrmakerComponent } from './qrmaker.component';

describe('QrmakerComponent', () => {
  let component: QrmakerComponent;
  let fixture: ComponentFixture<QrmakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrmakerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrmakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
