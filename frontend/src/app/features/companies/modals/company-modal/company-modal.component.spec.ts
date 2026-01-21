import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyModalComponent } from './company-modal.component';

describe('CompanyModalComponent', () => {
  let component: CompanyModalComponent;
  let fixture: ComponentFixture<CompanyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
