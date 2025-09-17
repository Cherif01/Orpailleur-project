import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemExpeditionComponent } from './add-item-expedition.component';

describe('AddItemExpeditionComponent', () => {
  let component: AddItemExpeditionComponent;
  let fixture: ComponentFixture<AddItemExpeditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemExpeditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemExpeditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
