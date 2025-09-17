import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitPurchaseComponent } from './init-purchase.component';

describe('InitPurchaseComponent', () => {
  let component: InitPurchaseComponent;
  let fixture: ComponentFixture<InitPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitPurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
