import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { AlertService } from '../../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent implements OnInit {
  projectForm!: FormGroup;
  alertMessage: string = '';
  alertType: 'error' | 'info' | 'warning' | 'success' = 'info';


  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private alertService: AlertService,
    private router: Router  // Inject the Router
  ) { }

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
          // Redirect to index page with success message
          this.alertService.setAlert('Project created successfully', 'success');
          this.router.navigate(['/project']);

        },
        error: (error) => {
          // Display error message on the create page
          this.alertMessage = error.error.message;
          this.alertType = 'error';
          window.scrollTo(0, 0); // Scroll to the top of the window
        }
      });
    }
  }
}
