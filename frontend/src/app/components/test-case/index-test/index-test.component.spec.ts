import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexTestComponent } from './index-test.component';

describe('IndexTestComponent', () => {
  let component: IndexTestComponent;
  let fixture: ComponentFixture<IndexTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndexTestComponent]
    });
    fixture = TestBed.createComponent(IndexTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
