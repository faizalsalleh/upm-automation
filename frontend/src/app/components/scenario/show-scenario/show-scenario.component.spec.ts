import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowScenarioComponent } from './show-scenario.component';

describe('ShowScenarioComponent', () => {
  let component: ShowScenarioComponent;
  let fixture: ComponentFixture<ShowScenarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowScenarioComponent]
    });
    fixture = TestBed.createComponent(ShowScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
