import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpAppComponent } from './help-app.component';

describe('HelpAppComponent', () => {
  let component: HelpAppComponent;
  let fixture: ComponentFixture<HelpAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
