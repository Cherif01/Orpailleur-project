import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationClientComponent } from './operation-client.component';

describe('OperationClientComponent', () => {
  let component: OperationClientComponent;
  let fixture: ComponentFixture<OperationClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
