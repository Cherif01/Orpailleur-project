import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExpeditionComponent } from './edit-expedition.component';

describe('EditExpeditionComponent', () => {
  let component: EditExpeditionComponent;
  let fixture: ComponentFixture<EditExpeditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditExpeditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExpeditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
