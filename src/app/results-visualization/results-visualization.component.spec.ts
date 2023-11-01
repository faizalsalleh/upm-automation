import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsVisualizationComponent } from './results-visualization.component';

describe('ResultsVisualizationComponent', () => {
  let component: ResultsVisualizationComponent;
  let fixture: ComponentFixture<ResultsVisualizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsVisualizationComponent]
    });
    fixture = TestBed.createComponent(ResultsVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
