import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluigTable } from './fluig-table';

describe('FluigTable', () => {
  let component: FluigTable;
  let fixture: ComponentFixture<FluigTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FluigTable],
    }).compileComponents();

    fixture = TestBed.createComponent(FluigTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
