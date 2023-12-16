import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadTestComponent } from './load-test.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoadTestComponent', () => {
  let component: LoadTestComponent;
  let fixture: ComponentFixture<LoadTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadTestComponent],
      imports: [ReactiveFormsModule] // Import ReactiveFormsModule
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
