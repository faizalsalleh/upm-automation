import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexScenarioComponent } from './index-scenario.component';

describe('IndexScenarioComponent', () => {
  let component: IndexScenarioComponent;
  let fixture: ComponentFixture<IndexScenarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndexScenarioComponent]
    });
    fixture = TestBed.createComponent(IndexScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
