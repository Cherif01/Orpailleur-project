import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BourseViewComponent } from './bourse-view.component';

describe('BourseViewComponent', () => {
  let component: BourseViewComponent;
  let fixture: ComponentFixture<BourseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BourseViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BourseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
