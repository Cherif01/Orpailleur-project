import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportjourComponent } from './rapportjour.component';

describe('RapportjourComponent', () => {
  let component: RapportjourComponent;
  let fixture: ComponentFixture<RapportjourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RapportjourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportjourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
