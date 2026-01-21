import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySuppliersModalComponent } from './company-suppliers-modal.component';

describe('CompanySuppliersModalComponent', () => {
  let component: CompanySuppliersModalComponent;
  let fixture: ComponentFixture<CompanySuppliersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanySuppliersModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySuppliersModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
