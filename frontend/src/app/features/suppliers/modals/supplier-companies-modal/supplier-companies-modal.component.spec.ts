import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCompaniesModalComponent } from './supplier-companies-modal.component';

describe('SupplierCompaniesModalComponent', () => {
  let component: SupplierCompaniesModalComponent;
  let fixture: ComponentFixture<SupplierCompaniesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierCompaniesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierCompaniesModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
