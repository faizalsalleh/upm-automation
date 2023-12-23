import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent implements OnInit {
  @ViewChild('alertDiv') alertDiv!: ElementRef;
  projectForm!: FormGroup; // Using the definite assignment assertion operator
  alertMessage: string = '';
  alertType: 'error' | 'info' | 'warning' | 'success' = 'info';


  constructor(private fb: FormBuilder, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      avg_response_time: [''],
      error_percentage: [''],
      cpu_usage: [''],
      memory_usage: [''],
      test_detail: ['']
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.projectService.addProject(this.projectForm.value).subscribe({
        next: (response) => {
          this.alertMessage = 'Project created successfully';
          this.alertType = 'success';
          //setTimeout(() => this.alertMessage = '', 5000); // Hide alert after 5 seconds
          window.scrollTo(0, 0); // Scroll to the top of the window
          // ... other success logic ...
        },
        error: (error) => {
          this.alertMessage = error.error.message;
          this.alertType = 'error';
          //setTimeout(() => this.alertMessage = '', 5000); // Hide alert after 5 seconds
          window.scrollTo(0, 0); // Scroll to the top of the window
          // ... other error handling logic ...
        }
      });

      if (this.alertDiv) {
        this.alertDiv.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

    }
  }
}
