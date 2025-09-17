import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConvertMoneyComponent } from './dialog-convert-money.component';

describe('DialogConvertMoneyComponent', () => {
  let component: DialogConvertMoneyComponent;
  let fixture: ComponentFixture<DialogConvertMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConvertMoneyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConvertMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
