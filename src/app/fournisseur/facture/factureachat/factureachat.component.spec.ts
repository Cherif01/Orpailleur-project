import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureachatComponent } from './factureachat.component';

describe('FactureachatComponent', () => {
  let component: FactureachatComponent;
  let fixture: ComponentFixture<FactureachatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactureachatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureachatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
