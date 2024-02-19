import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFactureComponent } from './view-facture.component';

describe('ViewFactureComponent', () => {
  let component: ViewFactureComponent;
  let fixture: ComponentFixture<ViewFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFactureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
