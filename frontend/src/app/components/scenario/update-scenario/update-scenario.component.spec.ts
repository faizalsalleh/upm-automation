import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateScenarioComponent } from './update-scenario.component';

describe('UpdateScenarioComponent', () => {
  let component: UpdateScenarioComponent;
  let fixture: ComponentFixture<UpdateScenarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateScenarioComponent]
    });
    fixture = TestBed.createComponent(UpdateScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
